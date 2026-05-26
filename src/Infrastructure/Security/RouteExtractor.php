<?php

namespace App\Infrastructure\Security;

use Symfony\Component\Routing\RouterInterface;

class RouteExtractor
{
    private RouterInterface $router;

    public function __construct(RouterInterface $router)
    {
        $this->router = $router;
    }

    public function extractAppRoutes(): array
    {
        $routes = [];
        $routeCollection = $this->router->getRouteCollection();

        foreach ($routeCollection as $name => $route) {
            // Filter out system routes (profiler, wdt, etc.)
            if (str_starts_with($name, '_') || str_starts_with($name, 'app_dashboard')) {
                continue;
            }

            $routes[] = [
                'name' => $name,
                'path' => $route->getPath(),
                'methods' => $route->getMethods(),
            ];
        }

        return $routes;
    }
}
