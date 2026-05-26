<?php

namespace App\UserInterface\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

final class DashboardController extends AbstractController
{
    #[Route('/', name: 'app_dashboard')]
    public function index(): Response
    {
        $user = $this->getUser();
        $userData = null;
        if ($user) {
            $userData = [
                'username' => $user->getUserIdentifier(),
                'roles' => $user->getRoles(),
            ];
        }

        return $this->render('dashboard/index.html.twig', [
            'user_data' => $userData,
        ]);
    }
}
