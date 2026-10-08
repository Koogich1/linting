import type { FC } from 'react'

import { UserCard } from '@/entities/user'
import { Button } from '@/shared'

export const LoginForm: FC = () => (
  <form>
    <UserCard />
    <Button>Log in</Button>
  </form>
)
