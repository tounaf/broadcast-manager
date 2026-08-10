<?php

namespace App\UserInterface\Controller\Api;

use App\Domain\Entity\ProgramSlot;
use App\Domain\Repository\ProgramSlotRepositoryInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/programs', name: 'api_programs_')]
class ProgramSlotController extends AbstractController
{
    public function __construct(
        private ProgramSlotRepositoryInterface $repository
    ) {}

    #[Route('', name: 'index', methods: ['GET'])]
    public function index(Request $request): JsonResponse
    {
        $startDateStr = $request->query->get('start_date');
        $endDateStr = $request->query->get('end_date');

        if ($startDateStr && $endDateStr) {
            try {
                $start = new \DateTimeImmutable($startDateStr);
                $end = new \DateTimeImmutable($endDateStr);
                $slots = $this->repository->findByDateRange($start, $end);
            } catch (\Exception $e) {
                return $this->json(['error' => 'Invalid date format'], Response::HTTP_BAD_REQUEST);
            }
        } else {
            $slots = $this->repository->findAll();
        }
        
        $data = array_map(fn(ProgramSlot $slot) => [
            'id' => $slot->getId(),
            'dayOfWeek' => $slot->getDayOfWeek(),
            'date' => $slot->getDate()?->format('Y-m-d'),
            'label' => $slot->getLabel(),
            'startTime' => $slot->getStartTime()->format('H:i'),
            'endTime' => $slot->getEndTime()->format('H:i'),
            'theme' => $slot->getTheme(),
            'isValidated' => $slot->isValidated(),
        ], $slots);

        return $this->json($data);
    }

    private function slotsOverlap(ProgramSlot $slotA, ProgramSlot $slotB): bool
    {
        if ($slotA->getId() !== null && $slotB->getId() !== null && $slotA->getId() === $slotB->getId()) {
            return false;
        }

        // Determine the dates/days they apply to
        $dateA = $slotA->getDate() ? $slotA->getDate()->format('Y-m-d') : null;
        $dateB = $slotB->getDate() ? $slotB->getDate()->format('Y-m-d') : null;
        $dayA = $slotA->getDayOfWeek();
        $dayB = $slotB->getDayOfWeek();

        $dayMatch = false;

        if ($dateA !== null && $dateB !== null) {
            // Both are specific dates
            $dayMatch = ($dateA === $dateB);
        } elseif ($dateA === null && $dateB === null) {
            // Both are recurring weekly slots
            $dayMatch = ($dayA === $dayB);
        } else {
            // One is specific, one is recurring
            $dayMatch = ($dayA === $dayB);
        }

        if (!$dayMatch) {
            return false;
        }

        $startA = $slotA->getStartTime()->format('H:i');
        $endA = $slotA->getEndTime()->format('H:i');
        $startB = $slotB->getStartTime()->format('H:i');
        $endB = $slotB->getEndTime()->format('H:i');

        return $startA < $endB && $endA > $startB;
    }

    #[Route('', name: 'create', methods: ['POST'])]
    public function create(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $slot = new ProgramSlot(
            $data['dayOfWeek'],
            $data['label'] ?? 'Sans titre',
            new \DateTimeImmutable($data['startTime']),
            new \DateTimeImmutable($data['endTime']),
            $data['theme'],
            isset($data['date']) ? new \DateTimeImmutable($data['date']) : null
        );

        // Check for overlap
        $existingSlots = $this->repository->findAll();
        foreach ($existingSlots as $existingSlot) {
            if ($this->slotsOverlap($slot, $existingSlot)) {
                return $this->json([
                    'error' => sprintf(
                        'Le programme chevauche "%s" (%s - %s)',
                        $existingSlot->getLabel(),
                        $existingSlot->getStartTime()->format('H:i'),
                        $existingSlot->getEndTime()->format('H:i')
                    )
                ], Response::HTTP_BAD_REQUEST);
            }
        }

        $this->repository->save($slot);

        return $this->json([
            'id' => $slot->getId(),
            'message' => 'Slot created successfully'
        ], Response::HTTP_CREATED);
    }

    #[Route('/{id}', name: 'update', methods: ['PUT'])]
    public function update(int $id, Request $request): JsonResponse
    {
        $slot = $this->repository->findById($id);
        if (!$slot) {
            return $this->json(['error' => 'Slot not found'], Response::HTTP_NOT_FOUND);
        }

        $data = json_decode($request->getContent(), true);
        
        $originalDayOfWeek = $slot->getDayOfWeek();
        $originalLabel = $slot->getLabel();
        $originalStartTime = $slot->getStartTime();
        $originalEndTime = $slot->getEndTime();
        $originalTheme = $slot->getTheme();
        $originalDate = $slot->getDate();
        $originalIsValidated = $slot->isValidated();

        if (isset($data['dayOfWeek'])) $slot->setDayOfWeek($data['dayOfWeek']);
        if (isset($data['label'])) $slot->setLabel($data['label']);
        if (isset($data['startTime'])) $slot->setStartTime(new \DateTimeImmutable($data['startTime']));
        if (isset($data['endTime'])) $slot->setEndTime(new \DateTimeImmutable($data['endTime']));
        if (isset($data['theme'])) $slot->setTheme($data['theme']);
        if (isset($data['date'])) $slot->setDate(new \DateTimeImmutable($data['date']));
        if (isset($data['isValidated'])) $data['isValidated'] ? $slot->validate() : $slot->invalidate();

        // Check for overlap
        $existingSlots = $this->repository->findAll();
        foreach ($existingSlots as $existingSlot) {
            if ($this->slotsOverlap($slot, $existingSlot)) {
                // Revert changes
                $slot->setDayOfWeek($originalDayOfWeek);
                $slot->setLabel($originalLabel);
                $slot->setStartTime($originalStartTime);
                $slot->setEndTime($originalEndTime);
                $slot->setTheme($originalTheme);
                $slot->setDate($originalDate);
                $originalIsValidated ? $slot->validate() : $slot->invalidate();

                return $this->json([
                    'error' => sprintf(
                        'Le programme chevauche "%s" (%s - %s)',
                        $existingSlot->getLabel(),
                        $existingSlot->getStartTime()->format('H:i'),
                        $existingSlot->getEndTime()->format('H:i')
                    )
                ], Response::HTTP_BAD_REQUEST);
            }
        }

        $this->repository->save($slot);

        return $this->json(['message' => 'Slot updated successfully']);
    }

    #[Route('/duplicate-day', name: 'duplicate_day', methods: ['POST'])]
    public function duplicateDay(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $sourceDateStr = $data['sourceDate'] ?? null;
        $targetDateStr = $data['targetDate'] ?? null;

        if (!$sourceDateStr || !$targetDateStr) {
            return $this->json(['error' => 'Veuillez renseigner les dates source et cible.'], Response::HTTP_BAD_REQUEST);
        }

        try {
            $sourceDate = new \DateTimeImmutable($sourceDateStr);
            $targetDate = new \DateTimeImmutable($targetDateStr);
        } catch (\Exception $e) {
            return $this->json(['error' => 'Format de date invalide.'], Response::HTTP_BAD_REQUEST);
        }

        $dayOfWeekMap = [
            'Monday' => 'Lundi',
            'Tuesday' => 'Mardi',
            'Wednesday' => 'Mercredi',
            'Thursday' => 'Jeudi',
            'Friday' => 'Vendredi',
            'Saturday' => 'Samedi',
            'Sunday' => 'Dimanche'
        ];
        $targetDayOfWeek = $dayOfWeekMap[$targetDate->format('l')];

        // Find slots on source date
        $allSlots = $this->repository->findAll();
        $sourceSlots = [];
        foreach ($allSlots as $slot) {
            if ($slot->getDate() && $slot->getDate()->format('Y-m-d') === $sourceDate->format('Y-m-d')) {
                $sourceSlots[] = $slot;
            }
        }

        if (empty($sourceSlots)) {
            return $this->json(['error' => 'Aucun programme à copier pour la date source spécifiée.'], Response::HTTP_BAD_REQUEST);
        }

        // Check for any potential duplicates causing overlaps
        $newSlots = [];
        foreach ($sourceSlots as $sourceSlot) {
            $duplicate = new ProgramSlot(
                $targetDayOfWeek,
                $sourceSlot->getLabel(),
                $sourceSlot->getStartTime(),
                $sourceSlot->getEndTime(),
                $sourceSlot->getTheme(),
                $targetDate
            );

            // Check against current repository slots & already added new slots
            foreach ($allSlots as $existingSlot) {
                if ($this->slotsOverlap($duplicate, $existingSlot)) {
                    return $this->json([
                        'error' => sprintf(
                            'Le programme "%s" (%s - %s) chevauche un programme existant à la date cible.',
                            $duplicate->getLabel(),
                            $duplicate->getStartTime()->format('H:i'),
                            $duplicate->getEndTime()->format('H:i')
                        )
                    ], Response::HTTP_BAD_REQUEST);
                }
            }

            foreach ($newSlots as $newSlot) {
                if ($this->slotsOverlap($duplicate, $newSlot)) {
                    return $this->json([
                        'error' => sprintf(
                            'Le programme "%s" (%s - %s) chevauche un autre programme en cours de copie.',
                            $duplicate->getLabel(),
                            $duplicate->getStartTime()->format('H:i'),
                            $duplicate->getEndTime()->format('H:i')
                        )
                    ], Response::HTTP_BAD_REQUEST);
                }
            }

            $newSlots[] = $duplicate;
        }

        // Save new slots
        foreach ($newSlots as $newSlot) {
            $this->repository->save($newSlot);
        }

        return $this->json(['message' => sprintf('%d programmes ont été dupliqués avec succès.', count($newSlots))]);
    }

    #[Route('/{id}/duplicate', name: 'duplicate_single', methods: ['POST'])]
    public function duplicateSingle(int $id, Request $request): JsonResponse
    {
        $slot = $this->repository->findById($id);
        if (!$slot) {
            return $this->json(['error' => 'Slot not found'], Response::HTTP_NOT_FOUND);
        }

        $data = json_decode($request->getContent(), true);
        $targetDateStr = $data['targetDate'] ?? null;

        if (!$targetDateStr) {
            return $this->json(['error' => 'Veuillez renseigner la date cible.'], Response::HTTP_BAD_REQUEST);
        }

        try {
            $targetDate = new \DateTimeImmutable($targetDateStr);
        } catch (\Exception $e) {
            return $this->json(['error' => 'Format de date cible invalide.'], Response::HTTP_BAD_REQUEST);
        }

        $dayOfWeekMap = [
            'Monday' => 'Lundi',
            'Tuesday' => 'Mardi',
            'Wednesday' => 'Mercredi',
            'Thursday' => 'Jeudi',
            'Friday' => 'Vendredi',
            'Saturday' => 'Samedi',
            'Sunday' => 'Dimanche'
        ];
        $targetDayOfWeek = $dayOfWeekMap[$targetDate->format('l')];

        $duplicate = new ProgramSlot(
            $targetDayOfWeek,
            $slot->getLabel(),
            $slot->getStartTime(),
            $slot->getEndTime(),
            $slot->getTheme(),
            $targetDate
        );

        // Check for overlaps
        $existingSlots = $this->repository->findAll();
        foreach ($existingSlots as $existingSlot) {
            if ($this->slotsOverlap($duplicate, $existingSlot)) {
                return $this->json([
                    'error' => sprintf(
                        'Le programme chevauche "%s" (%s - %s)',
                        $existingSlot->getLabel(),
                        $existingSlot->getStartTime()->format('H:i'),
                        $existingSlot->getEndTime()->format('H:i')
                    )
                ], Response::HTTP_BAD_REQUEST);
            }
        }

        $this->repository->save($duplicate);

        return $this->json(['message' => 'Le programme a été dupliqué avec succès.']);
    }

    #[Route('/{id}', name: 'delete', methods: ['DELETE'])]
    public function delete(int $id): JsonResponse
    {
        $slot = $this->repository->findById($id);
        if (!$slot) {
            return $this->json(['error' => 'Slot not found'], Response::HTTP_NOT_FOUND);
        }

        $this->repository->remove($slot);

        return $this->json(['message' => 'Slot deleted successfully']);
    }
}
