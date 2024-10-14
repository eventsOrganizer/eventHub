-- Enable Row Level Security on the user table
ALTER TABLE "user" ENABLE ROW LEVEL SECURITY;

-- Create a policy to allow users to view and update their own profile
CREATE POLICY "Users can view and update their own profile" ON "user"
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- Create a function to handle new user creation and sync data
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public."user" (id, email, encrypted_password)
  VALUES (NEW.id, NEW.email, NEW.encrypted_password);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a trigger to automatically create a user profile when a new auth user is created
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create a function to handle email updates
CREATE OR REPLACE FUNCTION public.handle_email_update() 
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public."user"
  SET email = NEW.email
  WHERE id = NEW.id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a trigger to sync email updates from auth.users to public.user
CREATE TRIGGER on_auth_email_updated
  AFTER UPDATE OF email ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_email_update();

-- Create a function to handle password updates
CREATE OR REPLACE FUNCTION public.handle_password_update() 
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public."user"
  SET encrypted_password = NEW.encrypted_password
  WHERE id = NEW.id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a trigger to sync password updates from auth.users to public.user
CREATE TRIGGER on_auth_password_updated
  AFTER UPDATE OF encrypted_password ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_password_update();

ALTER TABLE "user" DISABLE ROW LEVEL SECURITY;
