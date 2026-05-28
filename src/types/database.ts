export type UserType = 'brand' | 'creator'
export type CampagneType = 'affiliate' | 'gifting' | 'paid'
export type MatchStatus = 'pending' | 'accepted' | 'rejected' | 'completed'
export type Taal = 'nl' | 'fr' | 'both'

export interface Profile {
  id: string
  email: string
  user_type: UserType
  created_at: string
  updated_at: string
}

export interface Creator {
  id: string
  user_id: string
  tiktok_handle: string
  follower_count: number
  avg_engagement_rate: number
  niches: string[]
  taal: Taal
  provincie: string
  verified_seller: boolean
  gmv_30d: number
  avg_views: number
  bio: string | null
  created_at: string
  updated_at: string
}

export interface Brand {
  id: string
  user_id: string
  bedrijfsnaam: string
  website: string | null
  product_categorieen: string[]
  budget_min: number
  budget_max: number
  doelgroep_leeftijd: string | null
  doelgroep_geslacht: string | null
  campagne_type: CampagneType
  btw_nummer: string | null
  created_at: string
  updated_at: string
}

export interface Match {
  id: string
  brand_id: string
  creator_id: string
  ai_score: number
  ai_uitleg: string | null
  status: MatchStatus
  aangemaakt_op: string
  brand?: Brand
  creator?: Creator
}
