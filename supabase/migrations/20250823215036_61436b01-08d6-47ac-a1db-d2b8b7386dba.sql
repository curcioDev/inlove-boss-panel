-- Fix security warnings by setting search_path on functions
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION public.generate_product_short_code()
RETURNS TEXT AS $$
DECLARE
  new_code TEXT;
  counter INTEGER := 1;
BEGIN
  LOOP
    new_code := 'IL' || LPAD(counter::TEXT, 4, '0');
    IF NOT EXISTS (SELECT 1 FROM public.products WHERE short_code = new_code) THEN
      RETURN new_code;
    END IF;
    counter := counter + 1;
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION public.generate_qr_code_data(product_id UUID, short_code TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN 'inlove_product:' || product_id::TEXT || ':' || short_code;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;