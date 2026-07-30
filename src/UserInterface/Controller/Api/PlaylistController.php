<?php

namespace App\UserInterface\Controller\Api;

use App\Domain\Entity\Playlist;
use App\Domain\Entity\PlaylistItem;
use App\Domain\Repository\PlaylistRepositoryInterface;
use App\Domain\Repository\ProgramSlotRepositoryInterface;
use App\Domain\Repository\MediaRepositoryInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/playlists', name: 'api_playlists_')]
class PlaylistController extends AbstractController
{
    public function __construct(
        private PlaylistRepositoryInterface $playlistRepository,
        private ProgramSlotRepositoryInterface $slotRepository,
        private MediaRepositoryInterface $mediaRepository
    ) {}

    #[Route('/daily', name: 'daily', methods: ['GET'])]
    public function daily(Request $request): JsonResponse
    {
        $dateStr = $request->query->get('date', (new \DateTimeImmutable())->format('Y-m-d'));
        $date = new \DateTimeImmutable($dateStr);
        $dayOfWeekMap = [
            'Monday' => 'Lundi',
            'Tuesday' => 'Mardi',
            'Wednesday' => 'Mercredi',
            'Thursday' => 'Jeudi',
            'Friday' => 'Vendredi',
            'Saturday' => 'Samedi',
            'Sunday' => 'Dimanche'
        ];
        $dayOfWeek = $dayOfWeekMap[$date->format('l')];

        $slots = $this->slotRepository->findByDay($dayOfWeek);
        $data = [];

        foreach ($slots as $slot) {
            $playlist = $this->playlistRepository->findBySlotAndDate($slot, $date);

            $slotDuration = ($slot->getEndTime()->getTimestamp() - $slot->getStartTime()->getTimestamp());
            if ($slotDuration < 0) $slotDuration += 86400; // Case where it ends next day

            $items = [];
            $totalMediaDuration = 0;
            if ($playlist) {
                foreach ($playlist->getItems() as $item) {
                    $items[] = [
                        'id' => $item->getId(),
                        'position' => $item->getPosition(),
                        'media' => [
                            'id' => $item->getMedia()->getId(),
                            'title' => $item->getMedia()->getTitle(),
                            'duration' => $item->getMedia()->getDuration(),
                            'type' => $item->getMedia()->getType(),
                        ]
                    ];
                    $totalMediaDuration += $item->getMedia()->getDuration();
                }
            }

            $data[] = [
                'slot' => [
                    'id' => $slot->getId(),
                    'label' => $slot->getLabel(),
                    'startTime' => $slot->getStartTime()->format('H:i'),
                    'endTime' => $slot->getEndTime()->format('H:i'),
                    'theme' => $slot->getTheme(),
                    'duration' => $slotDuration,
                ],
                'playlist' => $playlist ? [
                    'id' => $playlist->getId(),
                    'status' => $playlist->getStatus(),
                    'items' => $items,
                    'totalDuration' => $totalMediaDuration,
                    'remainingDuration' => $slotDuration - $totalMediaDuration,
                ] : [
                    'id' => null,
                    'status' => 'empty',
                    'items' => [],
                    'totalDuration' => 0,
                    'remainingDuration' => $slotDuration,
                ]
            ];
        }

        return $this->json($data);
    }

    #[Route('/{slotId}', name: 'update', methods: ['POST'])]
    public function update(int $slotId, Request $request): JsonResponse
    {
        $payload = json_decode($request->getContent(), true);
        $date = new \DateTimeImmutable($payload['date']);
        $slot = $this->slotRepository->findById($slotId);

        if (!$slot) return $this->json(['error' => 'Slot not found'], 404);

        $playlist = $this->playlistRepository->findBySlotAndDate($slot, $date);
        if (!$playlist) {
            $playlist = new Playlist($slot, $date);
        }

        // Clear and rebuild items safely by converting collection to an array first
        foreach (iterator_to_array($playlist->getItems()) as $item) {
            $playlist->removeItem($item);
        }

        foreach ($payload['items'] as $index => $itemData) {
            $media = $this->mediaRepository->findById($itemData['mediaId']);
            if ($media) {
                $playlistItem = new PlaylistItem($media, $index);
                $playlist->addItem($playlistItem);
            }
        }

        if (isset($payload['status'])) {
            $playlist->setStatus($payload['status']);
        }

        $this->playlistRepository->save($playlist);

        return $this->json(['status' => 'Playlist updated', 'id' => $playlist->getId()]);
    }
}
