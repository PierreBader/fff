-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.users (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  email character varying NOT NULL UNIQUE,
  full_name character varying,
  created_at timestamp without time zone DEFAULT now(),
  updated_at timestamp without time zone DEFAULT now(),
  CONSTRAINT users_pkey PRIMARY KEY (id)
);
CREATE TABLE public.entities (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name character varying NOT NULL,
  description text,
  entity_type character varying NOT NULL CHECK (entity_type::text = ANY (ARRAY['organizer'::character varying, 'venue'::character varying, 'artist'::character varying, 'technician'::character varying, 'association'::character varying, 'other'::character varying]::text[])),
  contact_email character varying,
  contact_phone character varying,
  website_url character varying,
  facebook_url character varying,
  instagram_url character varying,
  youtube_url character varying,
  soundcloud_url character varying,
  cost_range character varying,
  availability text,
  action_zone character varying,
  lat double precision,
  lng double precision,
  is_approved boolean DEFAULT false,
  created_by uuid,
  created_at timestamp without time zone DEFAULT now(),
  updated_at timestamp without time zone DEFAULT now(),
  CONSTRAINT entities_pkey PRIMARY KEY (id),
  CONSTRAINT entities_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id)
);
CREATE TABLE public.entity_proposals (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  entity_data jsonb NOT NULL,
  status character varying NOT NULL DEFAULT 'pending'::character varying CHECK (status::text = ANY (ARRAY['pending'::character varying, 'approved'::character varying, 'rejected'::character varying]::text[])),
  proposed_by uuid NOT NULL,
  reviewed_by uuid,
  reviewed_at timestamp without time zone,
  feedback text,
  created_at timestamp without time zone DEFAULT now(),
  CONSTRAINT entity_proposals_pkey PRIMARY KEY (id),
  CONSTRAINT entity_proposals_proposed_by_fkey FOREIGN KEY (proposed_by) REFERENCES public.users(id),
  CONSTRAINT entity_proposals_reviewed_by_fkey FOREIGN KEY (reviewed_by) REFERENCES public.users(id)
);
CREATE TABLE public.reviews (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  entity_id uuid NOT NULL,
  user_id uuid NOT NULL,
  rating integer CHECK (rating >= 1 AND rating <= 5),
  comment text,
  created_at timestamp without time zone DEFAULT now(),
  CONSTRAINT reviews_pkey PRIMARY KEY (id),
  CONSTRAINT reviews_entity_id_fkey FOREIGN KEY (entity_id) REFERENCES public.entities(id),
  CONSTRAINT reviews_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
);
CREATE TABLE public.likes (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  entity_id uuid NOT NULL,
  user_id uuid NOT NULL,
  created_at timestamp without time zone DEFAULT now(),
  CONSTRAINT likes_pkey PRIMARY KEY (id),
  CONSTRAINT likes_entity_id_fkey FOREIGN KEY (entity_id) REFERENCES public.entities(id),
  CONSTRAINT likes_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
);