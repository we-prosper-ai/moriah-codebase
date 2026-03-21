// Auth Types
export interface User {
  id: string
  email: string
  name: string
  subscription_tier: 'free' | 'community' | 'premium'
  created_at: string
  last_login: string
}

export interface AuthToken {
  access_token: string
  token_type: string
  expires_in: number
}

// Teaching Types
export interface Teaching {
  id: string
  title: string
  module: string
  core_concept: string
  insights: string[]
  quotes: string[]
  action_steps: string[]
  case_studies: Array<{
    title: string
    description: string
    results: string
  }>
  tags: string[]
  created_at: string
  updated_at: string
}

// Chat Types
export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  teaching_ids?: string[]
  created_at: string
}

export interface ChatSession {
  id: string
  user_id: string
  title: string
  messages: Message[]
  created_at: string
  updated_at: string
}

// Community Types
export interface CommunityMember {
  id: string
  user_id: string
  name: string
  tier: string
  joined_at: string
}

export interface CommunityEvent {
  id: string
  title: string
  description: string
  date: string
  instructor: string
  type: 'workshop' | 'coaching-call' | 'mastermind'
  registered_count: number
}

// Payment Types
export interface Subscription {
  id: string
  user_id: string
  tier: string
  status: 'active' | 'canceled' | 'paused'
  current_period_start: string
  current_period_end: string
  amount: number
  currency: string
  auto_renew: boolean
}

export interface Invoice {
  id: string
  user_id: string
  amount: number
  currency: string
  status: 'paid' | 'pending' | 'failed'
  issued_at: string
  due_at: string
}
