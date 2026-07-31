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
        
        if (isset($data['dayOfWeek'])) $slot->setDayOfWeek($data['dayOfWeek']);
        if (isset($data['label'])) $slot->setLabel($data['label']);
        if (isset($data['startTime'])) $slot->setStartTime(new \DateTimeImmutable($data['startTime']));
        if (isset($data['endTime'])) $slot->setEndTime(new \DateTimeImmutable($data['endTime']));
        if (isset($data['theme'])) $slot->setTheme($data['theme']);
        if (isset($data['date'])) $slot->setDate(new \DateTimeImmutable($data['date']));
        if (isset($data['isValidated'])) $data['isValidated'] ? $slot->validate() : $slot->invalidate();

        $this->repository->save($slot);

        return $this->json(['message' => 'Slot updated successfully']);
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
