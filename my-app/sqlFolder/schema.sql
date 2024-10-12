CREATE TABLE category (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    type VARCHAR(7) CHECK (type IN ('service', 'event'))
);

CREATE TABLE subcategory (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    category_id INTEGER NOT NULL,
    FOREIGN KEY (category_id) REFERENCES category(id)
);

CREATE TABLE "user" (
    id UUID PRIMARY KEY REFERENCES auth.users,
    firstname VARCHAR(45),
    lastname VARCHAR(45),
    age INTEGER,
    username VARCHAR(45),
    gender VARCHAR(45),
    email VARCHAR(255) NOT NULL,
    encrypted_password VARCHAR(255) NOT NULL,
    details TEXT,
    bio TEXT
);


CREATE TABLE personal (
    id SERIAL PRIMARY KEY,
    subcategory_id INTEGER NOT NULL,
    user_id UUID NOT NULL,
    priceperhour INTEGER,
    name TEXT,
    details VARCHAR(45),
    FOREIGN KEY (subcategory_id) REFERENCES subcategory(id),
    FOREIGN KEY (user_id) REFERENCES "user"(id)
);

CREATE TABLE event (
    id SERIAL PRIMARY KEY,
    type VARCHAR(7) NOT NULL CHECK (type IN ('online', 'outdoor', 'indoor')),
    privacy BOOLEAN,
    user_id UUID NOT NULL,
    details TEXT,
    subcategory_id INTEGER NOT NULL,
    name TEXT,
    FOREIGN KEY (user_id) REFERENCES "user"(id),
    FOREIGN KEY (subcategory_id) REFERENCES subcategory(id)
);

CREATE TABLE local (
    id SERIAL PRIMARY KEY,
    details TEXT,
    subcategory_id INTEGER NOT NULL,
    user_id UUID NOT NULL,
    priceperhour INTEGER,
    FOREIGN KEY (subcategory_id) REFERENCES subcategory(id),
    FOREIGN KEY (user_id) REFERENCES "user"(id)
  
);

CREATE TABLE availability (
    id SERIAL PRIMARY KEY,
    start VARCHAR(45) NOT NULL,
    "end" VARCHAR(45) NOT NULL,
    daysofweek VARCHAR(9) CHECK (daysofweek IN ('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday')),
    personal_id INTEGER,
    event_id INTEGER,
    local_id INTEGER,
    material_id INTEGER, -- New foreign key for material
    date DATE,
    FOREIGN KEY (personal_id) REFERENCES personal(id),
    FOREIGN KEY (event_id) REFERENCES event(id),
    FOREIGN KEY (local_id) REFERENCES local(id),
    FOREIGN KEY (material_id) REFERENCES material(id) -- New foreign key constraint
);

CREATE TABLE chatroom (
    id SERIAL PRIMARY KEY,
    event_id INTEGER,
    user1_id UUID,
    user2_id UUID,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    type VARCHAR(7) CHECK (type IN ('private', 'public')),
    FOREIGN KEY (event_id) REFERENCES event(id) ON DELETE CASCADE,
    FOREIGN KEY (user1_id) REFERENCES "user"(id) ON DELETE CASCADE,
    FOREIGN KEY (user2_id) REFERENCES "user"(id) ON DELETE CASCADE,
    CONSTRAINT check_private_public 
        CHECK (
            (type = 'public' AND event_id IS NOT NULL AND user1_id IS NULL AND user2_id IS NULL) OR 
            (type = 'private' AND event_id IS NULL AND user1_id IS NOT NULL AND user2_id IS NOT NULL)
        )
);


CREATE TABLE material (
    id SERIAL PRIMARY KEY,
    subcategory_id INTEGER NOT NULL,
    user_id UUID NOT NULL,
    quantity INTEGER,
    price INTEGER,
    price_per_hour INTEGER, -- New column for price per hour
    sell_or_rent VARCHAR(4) CHECK (sell_or_rent IN ('sell', 'rent')), -- Using VARCHAR with a CHECK constraint
    name VARCHAR(45),
    details VARCHAR(255),
    sell_or_rent VARCHAR(4) CHECK (sell_or_rent IN ('sell', 'rent')),
    price_per_hour INTEGER,
    FOREIGN KEY (subcategory_id) REFERENCES subcategory(id),
    FOREIGN KEY (user_id) REFERENCES "user"(id)
);


CREATE TABLE comment (
    id SERIAL PRIMARY KEY,
    personal_id INTEGER,
    material_id INTEGER,
    event_id INTEGER,
    local_id INTEGER, -- New foreign key for local
    user_id UUID NOT NULL,
    details VARCHAR(255),
    FOREIGN KEY (personal_id) REFERENCES personal(id),
    FOREIGN KEY (material_id) REFERENCES material(id),
    FOREIGN KEY (event_id) REFERENCES event(id),
    FOREIGN KEY (local_id) REFERENCES local(id), -- New foreign key constraint
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
    id SERIAL PRIMARY KEY,
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
    user_id UUID ,
    personal_id INTEGER,
    material_id INTEGER,
    local_id INTEGER,
    url TEXT,
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

-- Create material_user table with status using CHECK constraint
CREATE TABLE material_user (
    material_id INTEGER NOT NULL,
    user_id UUID NOT NULL,
    status VARCHAR(10) DEFAULT 'pending' CHECK (status IN ('confirmed', 'rejected', 'pending')), -- Enum-like status
    PRIMARY KEY (material_id, user_id),
    FOREIGN KEY (material_id) REFERENCES material(id),
    FOREIGN KEY (user_id) REFERENCES "user"(id)
);

-- Create personal_user table with status using CHECK constraint
CREATE TABLE personal_user (
    personal_id INTEGER NOT NULL,
    user_id UUID NOT NULL,
    status VARCHAR(10) DEFAULT 'pending' CHECK (status IN ('confirmed', 'rejected', 'pending')), -- Enum-like status
    PRIMARY KEY (personal_id, user_id),
    FOREIGN KEY (personal_id) REFERENCES personal(id),
    FOREIGN KEY (user_id) REFERENCES "user"(id)
);

-- Create local_user table with status using CHECK constraint
CREATE TABLE local_user (
    local_id INTEGER NOT NULL,
    user_id UUID NOT NULL,
    status VARCHAR(10) DEFAULT 'pending' CHECK (status IN ('confirmed', 'rejected', 'pending')), -- Enum-like status
    PRIMARY KEY (local_id, user_id),
    FOREIGN KEY (local_id) REFERENCES local(id),
    FOREIGN KEY (user_id) REFERENCES "user"(id)
);


create table
  "like" (
    id SERIAL primary key,
    event_id integer, -- Nullable if not all references are required
    local_id integer,
    material_id integer,
    personal_id integer,
    user_id uuid not null, -- Assuming a user likes the entities
    foreign key (event_id) references event (id),
    foreign key (local_id) references local (id),
    foreign key (material_id) references material (id),
    foreign key (personal_id) references personal (id),
    foreign key (user_id) references "user" (id)
  );



-- Rest of the tables remain the same
-- ... (omitted for brevity)

