import type { FC } from 'react'

import { LoginForm } from '@/features/auth/ui/LoginForm'

export const Header: FC = () => (
  <header>
    <LoginForm />
  </header>
)
