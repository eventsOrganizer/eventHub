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
    disabled boolean not null default false,
    role public.user_role not null default 'user'::user_role,
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
    serial character varying(20) null,
    disabled boolean not null default false,
    constraint event_pkey primary key (id),
    constraint event_serial_key unique (serial),
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
    percentage double precision null,
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
    constraint availability_pkey primary key (id),
    constraint availability_event_id_fkey foreign key (event_id) references event (id) on delete cascade,
    constraint availability_local_id_fkey foreign key (local_id) references local (id) on delete cascade,
    constraint availability_personal_id_fkey foreign key (personal_id) references personal (id) on delete cascade,
    constraint fk_material foreign key (material_id) references material (id),
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

create table
  public.chatroom (
    id serial not null,
    event_id integer null,
    created_at timestamp without time zone null default current_timestamp,
    type character varying(7) null,
    user1_id uuid null,
    user2_id uuid null,
    constraint chatroom_pkey primary key (id),
    constraint chatroom_event_id_fkey foreign key (event_id) references event (id) on delete cascade,
    constraint fk_user1 foreign key (user1_id) references "user" (id) on delete cascade,
    constraint fk_user2 foreign key (user2_id) references "user" (id) on delete cascade,
    constraint chatroom_type_check check (
      (
        (
          type
        )::text = any (
          (
            array[
              'private'::character varying,
              'public'::character varying
            ]
          )::text[]
        )
      )
    ),
    constraint check_private_public check (
      (
        (
          (
            (
              type
            )::text = 'public'::text
          )
          and (event_id is not null)
          and (user1_id is null)
          and (user2_id is null)
        )
        or (
          (
            (
              type
            )::text = 'private'::text
          )
          and (event_id is null)
          and (user1_id is not null)
          and (user2_id is not null)
        )
      )
    )
  ) tablespace pg_default;


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
    percentage double precision null,
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


create table
  public.event_has_user (
    event_id integer not null,
    user_id uuid not null,
    constraint event_has_user_pkey primary key (event_id, user_id),
    constraint event_has_user_event_id_fkey foreign key (event_id) references event (id) on delete cascade,
    constraint event_has_user_user_id_fkey foreign key (user_id) references "user" (id)
  ) tablespace pg_default;


create table
  public.friend (
    user_id uuid not null,
    friend_id uuid not null,
    status character varying(8) null default 'pending'::character varying,
    constraint friend_pkey primary key (user_id, friend_id),
    constraint friends_friend_id_fkey foreign key (friend_id) references "user" (id) on delete cascade,
    constraint friends_user_id_fkey foreign key (user_id) references "user" (id) on delete cascade,
    constraint friends_status_check check (
      (
        (status)::text = any (
          (
            array[
              'pending'::character varying,
              'accepted'::character varying,
              'rejected'::character varying
            ]
          )::text[]
        )
      )
    )
  ) tablespace pg_default;


create table
  public.interest (
    id serial not null,
    subcategory_id integer not null,
    user_id uuid not null,
    constraint interest_pkey primary key (id),
    constraint interest_subcategory_id_fkey foreign key (subcategory_id) references subcategory (id),
    constraint interest_user_id_fkey foreign key (user_id) references "user" (id)
  ) tablespace pg_default;

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
    videoroom_id integer null,
    order_id bigint null,
    constraint media_pkey primary key (id),
    constraint media_event_id_fkey foreign key (event_id) references event (id) on delete cascade,
    constraint media_local_id_fkey foreign key (local_id) references local (id) on delete cascade,
    constraint media_material_id_fkey foreign key (material_id) references material (id) on delete cascade,
    constraint media_order_id_fkey foreign key (order_id) references "order" (id) on delete cascade,
    constraint media_personal_id_fkey foreign key (personal_id) references personal (id) on delete cascade,
    constraint media_user_id_fkey foreign key (user_id) references "user" (id) on delete cascade,
    constraint fk_album foreign key (album_id) references album (id) on delete cascade,
    constraint media_videoroom_id_fkey foreign key (videoroom_id) references videoroom (id)
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

create table
  public.message (
    id serial not null,
    chatroom_id integer not null,
    user_id uuid not null,
    content text not null,
    created_at timestamp without time zone null default current_timestamp,
    constraint messages_pkey primary key (id),
    constraint messages_chatroom_id_fkey foreign key (chatroom_id) references chatroom (id) on delete cascade,
    constraint messages_user_id_fkey foreign key (user_id) references "user" (id) on delete cascade
  ) tablespace pg_default;

create table
  public.ticket (
    id serial not null,
    event_id integer not null,
    price character varying(45) null,
    quantity character varying(45) null,
    constraint ticket_pkey primary key (id),
    constraint ticket_event_id_fkey foreign key (event_id) references event (id) on delete cascade
  ) tablespace pg_default;

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
    gifted_by uuid null,
    request_id integer null,
    totalprice numeric(10, 2) null,
    payedamount numeric(10, 2) null default 0,
    remainingamount numeric generated always as ((totalprice - payedamount)) stored (10, 2) null,
    constraint order_pkey primary key (id),
    constraint order_local_id_fkey foreign key (local_id) references local (id),
    constraint order_material_id_fkey foreign key (material_id) references material (id),
    constraint order_gifted_by_fkey foreign key (gifted_by) references "user" (id),
    constraint order_ticket_id_fkey foreign key (ticket_id) references ticket (id) on delete cascade,
    constraint order_user_id_fkey foreign key (user_id) references "user" (id),
    constraint order_personal_id_fkey foreign key (personal_id) references personal (id)
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
    payment_status character varying(10) null,
    constraint request_pkey primary key (id),
    constraint request_event_id_fkey foreign key (event_id) references event (id) on delete cascade,
    constraint request_friend_id_fkey foreign key (friend_id) references "user" (id),
    constraint request_local_id_fkey foreign key (local_id) references local (id),
    constraint request_material_id_fkey foreign key (material_id) references material (id),
    constraint request_personal_id_fkey foreign key (personal_id) references personal (id),
    constraint request_availability_id_fkey foreign key (availability_id) references availability (id),
    constraint request_user_id_fkey foreign key (user_id) references "user" (id),
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
    ),
    constraint request_payment_status_check check (
      (
        (payment_status)::text = any (
          (
            array[
              'pending'::character varying,
              'completed'::character varying,
              'failed'::character varying
            ]
          )::text[]
        )
      )
    )
  ) tablespace pg_default;

create unique index if not exists unique_pending_request on public.request using btree (user_id, event_id) tablespace pg_default
where
  ((status)::text = 'pending'::text);
create unique index if not exists unique_pending_request on public.request using btree (user_id, event_id) tablespace pg_default
where
  ((status)::text = 'pending'::text);


create table
  public.group (
    id serial not null,
    name text not null,
    details text null,
    privacy boolean null default false,
    constraint group_pkey primary key (id)
  ) tablespace pg_default;



create table
  public.follower (
    follower_id uuid not null,
    following_id uuid not null,
    followed_at timestamp without time zone null default current_timestamp,
    group_id integer null,
    constraint followers_pkey primary key (follower_id, following_id),
    constraint fk_group foreign key (group_id) references "group" (id) on delete cascade,
    constraint followers_follower_id_fkey foreign key (follower_id) references "user" (id) on delete cascade,
    constraint followers_following_id_fkey foreign key (following_id) references "user" (id) on delete cascade
  ) tablespace pg_default;


create table
  public.saved (
    id serial not null,
    user_id uuid not null,
    event_id integer null,
    personal_id integer null,
    material_id integer null,
    local_id integer null,
    created_at timestamp without time zone null default current_timestamp,
    constraint saved_pkey primary key (id),
    constraint saved_event_id_fkey foreign key (event_id) references event (id),
    constraint saved_local_id_fkey foreign key (local_id) references local (id),
    constraint saved_material_id_fkey foreign key (material_id) references material (id),
    constraint saved_personal_id_fkey foreign key (personal_id) references personal (id),
    constraint saved_user_id_fkey foreign key (user_id) references "user" (id)
  ) tablespace pg_default;


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
    constraint review_event_id_fkey foreign key (event_id) references event (id) on delete cascade,
    constraint review_local_id_fkey foreign key (local_id) references local (id),
    constraint review_material_id_fkey foreign key (material_id) references material (id),
    constraint review_personal_id_fkey foreign key (personal_id) references personal (id),
    constraint review_user_id_fkey foreign key (user_id) references "user" (id)
  ) tablespace pg_default;



create table
  public.like (
    id serial not null,
    event_id integer null,
    local_id integer null,
    material_id integer null,
    personal_id integer null,
    user_id uuid not null,
    constraint like_pkey primary key (id),
    constraint like_event_id_fkey foreign key (event_id) references event (id),
    constraint like_local_id_fkey foreign key (local_id) references local (id),
    constraint like_material_id_fkey foreign key (material_id) references material (id),
    constraint like_personal_id_fkey foreign key (personal_id) references personal (id),
    constraint like_user_id_fkey foreign key (user_id) references "user" (id)
  ) tablespace pg_default;

create table
  public.comment_replies (
    id serial not null,
    comment_id integer not null,
    reply_id integer not null,
    constraint comment_replies_pkey primary key (id),
    constraint comment_replies_comment_id_fkey foreign key (comment_id) references comment (id) on delete cascade,
    constraint comment_replies_reply_id_fkey foreign key (reply_id) references comment (id) on delete cascade
  ) tablespace pg_default;


create table
  public.notifications (
    id bigint generated by default as identity not null,
    user_id uuid null,
    title text not null,
    message text not null,
    created_at timestamp with time zone not null default timezone ('utc'::text, now()),
    is_read boolean null default false,
    type character varying(20) null,
    related_id integer null,
    constraint notifications_pkey primary key (id),
    constraint notifications_related_id_fkey foreign key (related_id) references request (id) on delete cascade,
    constraint notifications_user_id_fkey foreign key (user_id) references auth.users (id) on delete cascade,
    constraint notifications_type_check check (
      (
        (
          type
        )::text = any (
          (
            array[
              'request'::character varying,
              'response'::character varying,
              'payment'::character varying
            ]
          )::text[]
        )
      )
    )
  ) tablespace pg_default;

create index if not exists idx_notifications_user_id on public.notifications using btree (user_id) tablespace pg_default;

create index if not exists idx_notifications_created_at on public.notifications using btree (created_at) tablespace pg_default;

create table
  public.room_participants (
    id serial not null,
    room_id integer not null,
    user_id uuid not null,
    is_active boolean null default true,
    joined_at timestamp with time zone null default current_timestamp,
    left_at timestamp with time zone null,
    last_heartbeat timestamp with time zone null,
    daily_co_id character varying(255) null,
    constraint room_participants_pkey primary key (id),
    constraint unique_room_user unique (room_id, user_id),
    constraint room_participants_room_id_fkey foreign key (room_id) references videoroom (id) on delete cascade,
    constraint room_participants_user_id_fkey foreign key (user_id) references "user" (id) on delete cascade
  ) tablespace pg_default;

create index if not exists idx_room_participants_user_id on public.room_participants using btree (user_id) tablespace pg_default;

create index if not exists idx_room_participants_last_heartbeat on public.room_participants using btree (last_heartbeat) tablespace pg_default;

create index if not exists idx_room_participants_daily_co_id on public.room_participants using btree (daily_co_id) tablespace pg_default;

create index if not exists idx_room_participants_room_id on public.room_participants using btree (room_id) tablespace pg_default;


create table
  public.update (
    id serial not null,
    follower_id uuid not null,
    event_id integer null,
    personal_id integer null,
    material_id integer null,
    local_id integer null,
    group_id integer null,
    seen boolean null default false,
    created_at timestamp with time zone null default current_timestamp,
    constraint update_pkey primary key (id),
    constraint unique_update unique (
      follower_id,
      event_id,
      personal_id,
      material_id,
      local_id,
      group_id
    ),
    constraint fk_follower foreign key (follower_id) references "user" (id) on delete cascade,
    constraint fk_group foreign key (group_id) references "group" (id) on delete cascade,
    constraint fk_material foreign key (material_id) references material (id) on delete cascade,
    constraint fk_personal foreign key (personal_id) references personal (id) on delete cascade,
    constraint fk_local foreign key (local_id) references local (id) on delete cascade,
    constraint fk_event foreign key (event_id) references event (id) on delete cascade,
    constraint check_one_id_not_null check (
      (
        (
          (
            (
              (
                ((event_id is not null))::integer + ((personal_id is not null))::integer
              ) + ((material_id is not null))::integer
            ) + ((local_id is not null))::integer
          ) + ((group_id is not null))::integer
        ) = 1
      )
    )
  ) tablespace pg_default;

create index if not exists idx_update_follower on public.update using btree (follower_id) tablespace pg_default;

create index if not exists idx_update_seen on public.update using btree (seen) tablespace pg_default;



create table
  public.videoroom (
    id serial not null,
    url text not null,
    creator_id uuid null,
    is_connected boolean null default false,
    created_at timestamp with time zone null default current_timestamp,
    event_id integer null,
    is_ready boolean null default false,
    name text null,
    subcategory_id integer null,
    details text null,
    constraint videoroom_pkey primary key (id),
    constraint fk_creator foreign key (creator_id) references "user" (id) on delete cascade,
    constraint fk_event foreign key (event_id) references event (id) on delete cascade,
    constraint videoroom_subcategory_id_fkey foreign key (subcategory_id) references subcategory (id)
  ) tablespace pg_default;

create index if not exists idx_videoroom_event_id on public.videoroom using btree (event_id) tablespace pg_default;


create table
  public.invitation (
    id serial not null,
    sender_id uuid not null,
    receiver_id uuid not null,
    event_id integer null,
    local_id integer null,
    material_id integer null,
    personal_id integer null,
    group_id integer null,
    status boolean null default false,
    created_at timestamp with time zone null default current_timestamp,
    constraint invitation_pkey primary key (id),
    constraint fk_event foreign key (event_id) references event (id) on delete cascade,
    constraint fk_group foreign key (group_id) references "group" (id) on delete cascade,
    constraint fk_local foreign key (local_id) references local (id) on delete cascade,
    constraint fk_personal foreign key (personal_id) references personal (id) on delete cascade,
    constraint fk_receiver foreign key (receiver_id) references "user" (id) on delete cascade,
    constraint fk_sender foreign key (sender_id) references "user" (id) on delete cascade,
    constraint fk_material foreign key (material_id) references material (id) on delete cascade,
    constraint check_one_id_not_null check (
      (
        (
          (
            (
              (
                ((event_id is not null))::integer + ((local_id is not null))::integer
              ) + ((material_id is not null))::integer
            ) + ((personal_id is not null))::integer
          ) + ((group_id is not null))::integer
        ) = 1
      )
    )
  ) tablespace pg_default;

create index if not exists idx_invitation_sender on public.invitation using btree (sender_id) tablespace pg_default;

create index if not exists idx_invitation_receiver on public.invitation using btree (receiver_id) tablespace pg_default;

create index if not exists idx_invitation_status on public.invitation using btree (status) tablespace pg_default;


create table
  public.complaints (
    id serial not null,
    user_id uuid not null,
    created_at timestamp without time zone null default current_timestamp,
    resolved_at timestamp without time zone null,
    status character varying(10) null default 'pending'::character varying,
    details text not null,
    category character varying(20) not null,
    event_id integer null,
    personal_id integer null,
    material_id integer null,
    local_id integer null,
    reported_user_id uuid null,
    title character varying(255) not null default 'Default Title'::character varying,
    constraint complaints_pkey primary key (id),
    constraint complaints_event_id_fkey foreign key (event_id) references event (id) on delete set null,
    constraint complaints_local_id_fkey foreign key (local_id) references local (id) on delete set null,
    constraint complaints_material_id_fkey foreign key (material_id) references material (id) on delete set null,
    constraint complaints_personal_id_fkey foreign key (personal_id) references personal (id) on delete set null,
    constraint complaints_reported_user_id_fkey foreign key (reported_user_id) references "user" (id),
    constraint complaints_user_id_fkey foreign key (user_id) references "user" (id) on delete cascade,
    constraint complaints_status_check check (
      (
        (status)::text = any (
          (
            array[
              'pending'::character varying,
              'in_review'::character varying,
              'resolved'::character varying
            ]
          )::text[]
        )
      )
    ),
    constraint complaints_category_check check (
      (
        (category)::text = any (
          (
            array[
              'user'::character varying,
              'event'::character varying,
              'personal'::character varying,
              'material'::character varying,
              'local'::character varying,
              'other'::character varying
            ]
          )::text[]
        )
      )
    )
  ) tablespace pg_default;