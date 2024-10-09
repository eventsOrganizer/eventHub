

-- Create the tables
CREATE TABLE category (
    id SERIAL PRIMARY KEY,
    name VARCHAR(45) NOT NULL,
    type VARCHAR(7) CHECK (type IN ('service', 'event'))
);

CREATE TABLE subcategory (
    id SERIAL PRIMARY KEY,
    name VARCHAR(45) NOT NULL,
    category_id INTEGER NOT NULL,
    FOREIGN KEY (category_id) REFERENCES category(id)
);

CREATE TABLE "user" (
    id UUID PRIMARY KEY REFERENCES auth.users,
    firstname VARCHAR(45),
    lastname VARCHAR(45),
    age INTEGER,
    username VARCHAR(45),
    gender VARCHAR(45)
);

CREATE TABLE service (
    id SERIAL PRIMARY KEY,
    name VARCHAR(45),
    user_id UUID NOT NULL,
    subcategory_id INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES "user"(id),
    FOREIGN KEY (subcategory_id) REFERENCES subcategory(id)
);

CREATE TABLE personal (
    id SERIAL PRIMARY KEY,
    subcategory_id INTEGER NOT NULL,
    service_id INTEGER NOT NULL,
    priceperhour INTEGER,
    name VARCHAR(45),
    details VARCHAR(45),
    FOREIGN KEY (subcategory_id) REFERENCES subcategory(id),
    FOREIGN KEY (service_id) REFERENCES service(id)
);

CREATE TABLE event (
    id SERIAL PRIMARY KEY,
    type VARCHAR(7) NOT NULL CHECK (type IN ('online', 'outdoor', 'indoor')),
    privacy BOOLEAN,
    user_id UUID NOT NULL,
    details VARCHAR(255),
    subcategory_id INTEGER NOT NULL,
    name VARCHAR(45),
    FOREIGN KEY (user_id) REFERENCES "user"(id),
    FOREIGN KEY (subcategory_id) REFERENCES subcategory(id)
);

CREATE TABLE local (
    id SERIAL PRIMARY KEY,
    subcategory_id INTEGER NOT NULL,
    service_id INTEGER NOT NULL,
    priceperhour INTEGER,
    FOREIGN KEY (subcategory_id) REFERENCES subcategory(id),
    FOREIGN KEY (service_id) REFERENCES service(id)
);

CREATE TABLE availability (
    id SERIAL PRIMARY KEY,
    start VARCHAR(45) NOT NULL,
    "end" VARCHAR(45) NOT NULL,
    daysofweek VARCHAR(9) NOT NULL CHECK (daysofweek IN ('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday')),
    personal_id INTEGER,
    event_id INTEGER,
    local_id INTEGER,
    date DATE,
    FOREIGN KEY (personal_id) REFERENCES personal(id),
    FOREIGN KEY (event_id) REFERENCES event(id),
    FOREIGN KEY (local_id) REFERENCES local(id)
);

CREATE TABLE chatroom (
    id SERIAL PRIMARY KEY,
    event_id INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (event_id) REFERENCES event(id) ON DELETE CASCADE
);

CREATE TABLE material (
    id SERIAL PRIMARY KEY,
    subcategory_id INTEGER NOT NULL,
    service_id INTEGER NOT NULL,
    quantity INTEGER,
    price INTEGER,
    name VARCHAR(45),
    details VARCHAR(255),
    FOREIGN KEY (subcategory_id) REFERENCES subcategory(id),
    FOREIGN KEY (service_id) REFERENCES service(id)
);

CREATE TABLE comment (
    id SERIAL PRIMARY KEY,
    personal_id INTEGER,
    material_id INTEGER,
    event_id INTEGER,
    user_id UUID NOT NULL,
    details VARCHAR(255),
    FOREIGN KEY (personal_id) REFERENCES personal(id),
    FOREIGN KEY (material_id) REFERENCES material(id),
    FOREIGN KEY (event_id) REFERENCES event(id),
    FOREIGN KEY (user_id) REFERENCES "user"(id)
);

CREATE TABLE event_has_user (
    event_id INTEGER NOT NULL,
    user_id UUID NOT NULL,
    PRIMARY KEY (event_id, user_id),
    FOREIGN KEY (event_id) REFERENCES event(id),
    FOREIGN KEY (user_id) REFERENCES "user"(id)
);

CREATE TABLE friends (
    user_id UUID NOT NULL,
    friend_id UUID NOT NULL,
    status VARCHAR(8) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
    PRIMARY KEY (user_id, friend_id),
    FOREIGN KEY (user_id) REFERENCES "user"(id) ON DELETE CASCADE,
    FOREIGN KEY (friend_id) REFERENCES "user"(id) ON DELETE CASCADE
);

CREATE TABLE interest (
    idinterest SERIAL PRIMARY KEY,
    subcategory_id INTEGER NOT NULL,
    user_id UUID NOT NULL,
    FOREIGN KEY (subcategory_id) REFERENCES subcategory(id),
    FOREIGN KEY (user_id) REFERENCES "user"(id)
);

CREATE TABLE location (
    id SERIAL PRIMARY KEY,
    longitude FLOAT,
    latitude FLOAT,
    user_id UUID,
    local_id INTEGER,
    event_id INTEGER,
    FOREIGN KEY (user_id) REFERENCES "user"(id),
    FOREIGN KEY (local_id) REFERENCES local(id),
    FOREIGN KEY (event_id) REFERENCES event(id)
);

CREATE TABLE media (
    id SERIAL PRIMARY KEY,
    event_id INTEGER,
    user_id UUID NOT NULL,
    personal_id INTEGER,
    material_id INTEGER,
    local_id INTEGER,
    url VARCHAR(45),
    FOREIGN KEY (event_id) REFERENCES event(id),
    FOREIGN KEY (user_id) REFERENCES "user"(id),
    FOREIGN KEY (personal_id) REFERENCES personal(id),
    FOREIGN KEY (material_id) REFERENCES material(id),
    FOREIGN KEY (local_id) REFERENCES local(id)
);

CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    chatroom_id INTEGER NOT NULL,
    user_id UUID NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (chatroom_id) REFERENCES chatroom(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES "user"(id) ON DELETE CASCADE
);

CREATE TABLE ticket (
    id SERIAL PRIMARY KEY,
    event_id INTEGER NOT NULL,
    price VARCHAR(45),
    quantity VARCHAR(45),
    FOREIGN KEY (event_id) REFERENCES event(id)
);

CREATE TABLE "order" (
    id SERIAL PRIMARY KEY,
    personal_id INTEGER,
    local_id INTEGER,
    material_id INTEGER,
    user_id UUID NOT NULL,
    ticket_id INTEGER,
    FOREIGN KEY (personal_id) REFERENCES personal(id),
    FOREIGN KEY (local_id) REFERENCES local(id),
    FOREIGN KEY (material_id) REFERENCES material(id),
    FOREIGN KEY (user_id) REFERENCES "user"(id),
    FOREIGN KEY (ticket_id) REFERENCES ticket(id)
);

CREATE TABLE request (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL,
    event_id INTEGER NOT NULL,
    status VARCHAR(8) CHECK (status IN ('pending', 'accepted', 'refused')),
    FOREIGN KEY (user_id) REFERENCES "user"(id),
    FOREIGN KEY (event_id) REFERENCES event(id)
);

CREATE TABLE review (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL,
    event_id INTEGER,
    personal_id INTEGER,
    material_id INTEGER,
    local_id INTEGER,
    rate FLOAT,
    total INTEGER,
    FOREIGN KEY (user_id) REFERENCES "user"(id),
    FOREIGN KEY (event_id) REFERENCES event(id),
    FOREIGN KEY (personal_id) REFERENCES personal(id),
    FOREIGN KEY (material_id) REFERENCES material(id),
    FOREIGN KEY (local_id) REFERENCES local(id)
);

-- Enable Row Level Security on the user table
ALTER TABLE "user" ENABLE ROW LEVEL SECURITY;

-- Create a policy to allow users to view and update their own profile
CREATE POLICY "Users can view and update their own profile" ON "user"
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- Create a trigger to automatically create a user profile when a new auth user is created
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public."user" (id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();