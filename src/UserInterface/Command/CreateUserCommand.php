<?php

namespace App\UserInterface\Command;

use App\Domain\Entity\User;
use App\Domain\Repository\UserRepositoryInterface;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

#[AsCommand(
    name: 'app:user:create',
    description: 'Creates a new user.',
)]
class CreateUserCommand extends Command
{
    public function __construct(
        private UserRepositoryInterface $userRepository,
        private UserPasswordHasherInterface $passwordHasher
    ) {
        parent::__construct();
    }

    protected function configure(): void
    {
        $this
            ->addArgument('username', InputArgument::REQUIRED, 'The username of the user.')
            ->addArgument('email', InputArgument::REQUIRED, 'The email of the user.')
            ->addArgument('password', InputArgument::REQUIRED, 'The password of the user.')
        ;
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);
        $username = $input->getArgument('username');
        $email = $input->getArgument('email');
        $password = $input->getArgument('password');

        $existingUser = $this->userRepository->findByUsername($username);
        if ($existingUser) {
            $io->error(sprintf('User with username "%s" already exists.', $username));
            return Command::FAILURE;
        }

        $user = new User($username, $email);
        $hashedPassword = $this->passwordHasher->hashPassword($user, $password);
        $user->setPassword($hashedPassword);

        $this->userRepository->save($user);

        $io->success(sprintf('User "%s" was successfully created.', $username));

        return Command::SUCCESS;
    }
}
