create table
  public.category (
    id serial not null,
    name text not null,
    type character varying(7) null,
    constraint category_pkey primary key (id),
    constraint category_type_check check (
      (
        (
          type
        )::text = any (
          (
            array[
              'service'::character varying,
              'event'::character varying
            ]
          )::text[]
        )
      )
    )
  ) tablespace pg_default;

create table
  public.subcategory (
    id serial not null,
    name text not null,
    category_id integer not null,
    constraint subcategory_pkey primary key (id),
    constraint subcategory_category_id_fkey foreign key (category_id) references category (id)
  ) tablespace pg_default;

create table
  public.user (
    id uuid not null,
    firstname character varying(45) null,
    lastname character varying(45) null,
    age integer null,
    username character varying(45) null,
    gender character varying(45) null,
    email character varying(255) not null,
    encrypted_password character varying(255) not null,
    details text null,
    bio text null,
    constraint user_pkey primary key (id),
    constraint user_id_fkey foreign key (id) references auth.users (id)
  ) tablespace pg_default;

create table
  public.personal (
    id serial not null,
    subcategory_id integer not null,
    user_id uuid not null,
    priceperhour integer null,
    name text null,
    details text null,
    percentage double precision null,
    startdate date null,
    enddate date null,
    disabled boolean not null default false,
    constraint personal_pkey primary key (id),
    constraint personal_subcategory_id_fkey foreign key (subcategory_id) references subcategory (id),
    constraint personal_user_id_fkey foreign key (user_id) references "user" (id)
  ) tablespace pg_default;

create table
  public.event (
    id serial not null,
    type character varying(7) not null,
    privacy boolean null,
    user_id uuid not null,
    details text null,
    subcategory_id integer not null,
    name text null,
    group_id integer null,
    constraint event_pkey primary key (id),
    constraint event_group_id_fkey foreign key (group_id) references "group" (id),
    constraint event_subcategory_id_fkey foreign key (subcategory_id) references subcategory (id),
    constraint event_user_id_fkey foreign key (user_id) references "user" (id),
    constraint event_type_check check (
      (
        (
          type
        )::text = any (
          (
            array[
              'online'::character varying,
              'outdoor'::character varying,
              'indoor'::character varying
            ]
          )::text[]
        )
      )
    )
  ) tablespace pg_default;

create table
  public.local (
    id serial not null,
    subcategory_id integer not null,
    user_id uuid not null,
    priceperhour integer null,
    name text null,
    details text null,
    startdate date null,
    enddate date null,
    disabled boolean not null default false,
    constraint local_pkey primary key (id),
    constraint local_subcategory_id_fkey foreign key (subcategory_id) references subcategory (id),
    constraint local_user_id_fkey foreign key (user_id) references "user" (id)
  ) tablespace pg_default;

create table
  public.availability (
    id serial not null,
    start character varying(45) null,
    "end" character varying(45) null,
    daysofweek character varying(9) null,
    personal_id integer null,
    event_id integer null,
    local_id integer null,
    date date null,
    material_id integer null,
    startdate date null,
    enddate date null,
    statusday public.statusday null default 'available'::statusday,
    request_id integer null,
    constraint availability_pkey primary key (id),
    constraint availability_event_id_fkey foreign key (event_id) references event (id) on delete cascade,
    constraint availability_local_id_fkey foreign key (local_id) references local (id) on delete cascade,
    constraint availability_personal_id_fkey foreign key (personal_id) references personal (id) on delete cascade,
    constraint fk_material foreign key (material_id) references material (id),
    constraint availability_request_id_fkey foreign key (request_id) references request (id) on delete cascade,
    constraint availability_daysofweek_check check (
      (
        (daysofweek)::text = any (
          (
            array[
              'monday'::character varying,
              'tuesday'::character varying,
              'wednesday'::character varying,
              'thursday'::character varying,
              'friday'::character varying,
              'saturday'::character varying,
              'sunday'::character varying
            ]
          )::text[]
        )
      )
    )
  ) tablespace pg_default;

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


create table
  public.material (
    id serial not null,
    subcategory_id integer not null,
    user_id uuid not null,
    quantity integer null,
    price integer null,
    name character varying(45) null,
    details character varying(255) null,
    sell_or_rent character varying(4) null,
    price_per_hour integer null,
    startdate date null,
    enddate date null,
    disabled boolean null,
    constraint material_pkey primary key (id),
    constraint material_subcategory_id_fkey foreign key (subcategory_id) references subcategory (id),
    constraint material_user_id_fkey foreign key (user_id) references "user" (id),
    constraint material_sell_or_rent_check check (
      (
        (sell_or_rent)::text = any (
          (
            array[
              'sell'::character varying,
              'rent'::character varying
            ]
          )::text[]
        )
      )
    )
  ) tablespace pg_default;

create table
  public.comment (
    id serial not null,
    personal_id integer null,
    material_id integer null,
    event_id integer null,
    user_id uuid not null,
    details character varying(255) null,
    local_id integer null,
    created_at timestamp without time zone null default current_timestamp,
    parent_id integer null,
    constraint comment_pkey primary key (id),
    constraint comment_material_id_fkey foreign key (material_id) references material (id),
    constraint comment_personal_id_fkey foreign key (personal_id) references personal (id),
    constraint comment_event_id_fkey foreign key (event_id) references event (id) on delete cascade,
    constraint comment_user_id_fkey foreign key (user_id) references "user" (id),
    constraint fk_local foreign key (local_id) references local (id),
    constraint fk_parent_comment foreign key (parent_id) references comment (id) on delete cascade
  ) tablespace pg_default;


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

create table
  public.location (
    id serial not null,
    longitude double precision null,
    latitude double precision null,
    user_id uuid null,
    local_id integer null,
    event_id integer null,
    personal_id integer null,
    material_id integer null,
    constraint location_pkey primary key (id),
    constraint location_event_id_fkey foreign key (event_id) references event (id) on delete cascade,
    constraint location_local_id_fkey foreign key (local_id) references local (id) on delete cascade,
    constraint location_material_id_fkey foreign key (material_id) references material (id) on delete cascade,
    constraint location_personal_id_fkey foreign key (personal_id) references personal (id) on delete cascade,
    constraint location_user_id_fkey foreign key (user_id) references "user" (id) on delete cascade
  ) tablespace pg_default;
////-////
create table
  public.media (
    id serial not null,
    event_id integer null,
    user_id uuid null,
    personal_id integer null,
    material_id integer null,
    local_id integer null,
    url text null,
    type text null,
    album_id bigint null,
    constraint media_pkey primary key (id),
    constraint media_event_id_fkey foreign key (event_id) references event (id) on delete cascade,
    constraint media_local_id_fkey foreign key (local_id) references local (id) on delete cascade,
    constraint fk_album foreign key (album_id) references album (id) on delete cascade,
    constraint media_personal_id_fkey foreign key (personal_id) references personal (id) on delete cascade,
    constraint media_user_id_fkey foreign key (user_id) references "user" (id) on delete cascade,
    constraint media_material_id_fkey foreign key (material_id) references material (id) on delete cascade
  ) tablespace pg_default;

create table
  public.album (
    id serial not null,
    name character varying(255) null,
    details text null,
    user_id uuid not null,
    constraint album_pkey primary key (id),
    constraint album_user_id_fkey foreign key (user_id) references "user" (id)
  ) tablespace pg_default;
////-////

CREATE TABLE message (
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

create table
  public.order (
    id serial not null,
    personal_id integer null,
    local_id integer null,
    material_id integer null,
    user_id uuid not null,
    ticket_id integer null,
    type character varying null,
    payment boolean null,
    payment_id text null,
    token text null,
    constraint order_pkey primary key (id),
    constraint order_local_id_fkey foreign key (local_id) references local (id),
    constraint order_material_id_fkey foreign key (material_id) references material (id),
    constraint order_personal_id_fkey foreign key (personal_id) references personal (id),
    constraint order_ticket_id_fkey foreign key (ticket_id) references ticket (id),
    constraint order_user_id_fkey foreign key (user_id) references "user" (id)
  ) tablespace pg_default;

create table
  public.request (
    id serial not null,
    user_id uuid not null,
    event_id integer null,
    status character varying(10) null,
    personal_id integer null,
    created_at timestamp with time zone null,
    local_id integer null,
    material_id integer null,
    friend_id uuid null,
    is_read boolean null default false,
    is_action_read boolean null default false,
    availability_id integer null,
    constraint request_pkey primary key (id),
    constraint request_event_id_fkey foreign key (event_id) references event (id),
    constraint request_friend_id_fkey foreign key (friend_id) references "user" (id),
    constraint request_local_id_fkey foreign key (local_id) references local (id),
    constraint request_material_id_fkey foreign key (material_id) references material (id),
    constraint request_personal_id_fkey foreign key (personal_id) references personal (id),
    constraint request_user_id_fkey foreign key (user_id) references "user" (id),
    constraint request_availability_id_fkey foreign key (availability_id) references availability (id),
    constraint request_status_check check (
      (
        (status)::text = any (
          array[
            ('pending'::character varying)::text,
            ('accepted'::character varying)::text,
            ('refused'::character varying)::text
          ]
        )
      )
    )
  ) tablespace pg_default;

CREATE TABLE "group" (
    id SERIAL PRIMARY KEY,
    privacy BOOLEAN,
    name TEXT NOT NULL, -- Group name
    details TEXT -- Group details or description
);



CREATE TABLE follower (
    follower_id UUID NOT NULL,
    following_id UUID NOT NULL,
    followed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (follower_id, following_id),
    FOREIGN KEY (follower_id) REFERENCES "user"(id) ON DELETE CASCADE,  -- The follower
    FOREIGN KEY (following_id) REFERENCES "user"(id) ON DELETE CASCADE  -- The user being followed
);



CREATE TABLE saved (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL,
    event_id INTEGER,
    personal_id INTEGER,
    material_id INTEGER,
    local_id INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Foreign key references
    FOREIGN KEY (user_id) REFERENCES "user"(id),
    FOREIGN KEY (event_id) REFERENCES event(id),
    FOREIGN KEY (personal_id) REFERENCES personal(id),
    FOREIGN KEY (material_id) REFERENCES material(id),
    FOREIGN KEY (local_id) REFERENCES local(id)
);



create table
  public.review (
    id serial not null,
    user_id uuid not null,
    event_id integer null,
    personal_id integer null,
    material_id integer null,
    local_id integer null,
    rate double precision null,
    constraint review_pkey primary key (id),
    constraint review_event_id_fkey foreign key (event_id) references event (id),
    constraint review_local_id_fkey foreign key (local_id) references local (id),
    constraint review_material_id_fkey foreign key (material_id) references material (id),
    constraint review_personal_id_fkey foreign key (personal_id) references personal (id),
    constraint review_user_id_fkey foreign key (user_id) references "user" (id)
  ) tablespace pg_default;



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

create table
  public.comment_replies (
    id serial not null,
    comment_id integer not null,
    reply_id integer not null,
    constraint comment_replies_pkey primary key (id),
    constraint comment_replies_comment_id_fkey foreign key (comment_id) references comment (id) on delete cascade,
    constraint comment_replies_reply_id_fkey foreign key (reply_id) references comment (id) on delete cascade
  ) tablespace pg_default;


-- Rest of the tables remain the same
-- ... (omitted for brevity)

