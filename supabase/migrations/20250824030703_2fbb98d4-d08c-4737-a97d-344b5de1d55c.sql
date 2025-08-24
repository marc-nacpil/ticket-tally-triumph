-- Create tickets table for raffle system
CREATE TABLE public.tickets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ticket_number TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  contact TEXT NOT NULL,
  careOf TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (since this is a public raffle system)
CREATE POLICY "Allow all operations on tickets" 
ON public.tickets 
FOR ALL 
USING (true)
WITH CHECK (true);

-- Create index for faster ticket number lookups
CREATE INDEX idx_tickets_ticket_number ON public.tickets(ticket_number);