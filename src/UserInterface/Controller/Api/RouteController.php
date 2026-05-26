<?php

namespace App\UserInterface\Controller\Api;

use App\Infrastructure\Security\RouteExtractor;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/routes', name: 'api_routes_')]
class RouteController extends AbstractController
{
    private RouteExtractor $routeExtractor;

    public function __construct(RouteExtractor $routeExtractor)
    {
        $this->routeExtractor = $routeExtractor;
    }

    #[Route('', name: 'list', methods: ['GET'])]
    public function list(): JsonResponse
    {
        return $this->json($this->routeExtractor->extractAppRoutes());
    }
}
