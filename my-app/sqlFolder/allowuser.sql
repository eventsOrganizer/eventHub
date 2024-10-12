ALTER POLICY "Users can view and update their own profile" ON "user"
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);
