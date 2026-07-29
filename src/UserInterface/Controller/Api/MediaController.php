<?php

namespace App\UserInterface\Controller\Api;

use App\Domain\Entity\Media;
use App\Domain\Repository\MediaRepositoryInterface;
use App\Domain\Repository\PlaylistRepositoryInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/medias', name: 'api_medias_')]
class MediaController extends AbstractController
{
    public function __construct(
        private MediaRepositoryInterface $mediaRepository,
        private PlaylistRepositoryInterface $playlistRepository
    ) {}

    #[Route('', name: 'index', methods: ['GET'])]
    public function index(Request $request): JsonResponse
    {
        $medias = $this->mediaRepository->findAll();
        $type = $request->query->get('type');

        $today = new \DateTimeImmutable('today');
        $broadcastedMediaIds = $this->playlistRepository->findBroadcastedMediaIdsBefore($today);

        $data = [];
        foreach ($medias as $media) {
            if ($type && $media->getType() !== $type) {
                continue;
            }
            $data[] = [
                'id' => $media->getId(),
                'title' => $media->getTitle(),
                'duration' => $media->getDuration(),
                'type' => $media->getType(),
                'is_broadcasted' => in_array($media->getId(), $broadcastedMediaIds, true),
            ];
        }
        return $this->json($data);
    }

    #[Route('', name: 'create', methods: ['POST'])]
    public function create(Request $request): JsonResponse
    {
        $payload = json_decode($request->getContent(), true);
        $media = new Media(
            $payload['title'],
            (int)$payload['duration'],
            $payload['type']
        );

        $this->mediaRepository->save($media);
        return $this->json([
            'id' => $media->getId(),
            'title' => $media->getTitle(),
            'duration' => $media->getDuration(),
            'type' => $media->getType(),
        ], Response::HTTP_CREATED);
    }

    #[Route('/{id}', name: 'delete', methods: ['DELETE'])]
    public function delete(int $id): JsonResponse
    {
        $media = $this->mediaRepository->findById($id);
        if ($media) {
            $this->mediaRepository->remove($media);
        }
        return $this->json(['status' => 'Media removed']);
    }
}
