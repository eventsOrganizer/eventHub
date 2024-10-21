# eventHub
```
eventHub
├─ et --hard 3f42ac7dfab660ffd48645ae3f14328c17baa50e
├─ et --hard 780c68359a11b4ea3be660f7e0f532f01368141e
├─ et --hard commit-hash
├─ my-app
│  ├─ %ProgramData%
│  │  └─ Microsoft
│  │     └─ Windows
│  │        └─ UUS
│  │           └─ State
│  │              └─ _active.uusver
│  ├─ .env
│  ├─ .expo
│  │  ├─ devices.json
│  │  └─ README.md
│  ├─ app
│  │  ├─ api
│  │  │  └─ event
│  │  │     └─ eventApi.ts
│  │  ├─ assets
│  │  │  ├─ adaptive-icon.png
│  │  │  ├─ background.png
│  │  │  ├─ favicon.png
│  │  │  ├─ icon.png
│  │  │  ├─ slide1.jpg
│  │  │  ├─ slide2.jpg
│  │  │  ├─ slide3.jpg
│  │  │  ├─ slide4.jpg
│  │  │  ├─ splash.png
│  │  │  ├─ splash1.png
│  │  │  └─ svgs
│  │  │     └─ OnBoardingSvg.tsx
│  │  ├─ components
│  │  │  ├─ Auth
│  │  │  │  ├─ SignIn.tsx
│  │  │  │  └─ SignUp.tsx
│  │  │  ├─ Background.tsx
│  │  │  ├─ Calendar.tsx
│  │  │  ├─ component.tsx
│  │  │  ├─ event
│  │  │  │  ├─ AttendeesSection.tsx
│  │  │  │  ├─ BeautifulSectionHeader.tsx
│  │  │  │  ├─ ChatListScreen.tsx
│  │  │  │  ├─ ChatRoomScreen.tsx
│  │  │  │  ├─ CommentsSection.tsx
│  │  │  │  ├─ CustomButton.tsx
│  │  │  │  ├─ EventCard.tsx
│  │  │  │  ├─ EventDetails.tsx
│  │  │  │  ├─ EventSection.tsx
│  │  │  │  ├─ EventSectionContainer.tsx
│  │  │  │  ├─ JoinEventButton.tsx
│  │  │  │  ├─ OrganizerProfileScreen.tsx
│  │  │  │  ├─ PhotosSection.tsx
│  │  │  │  ├─ profile
│  │  │  │  │  ├─ AlbumList.tsx
│  │  │  │  │  ├─ AttendedEventList.tsx
│  │  │  │  │  ├─ CircularNavigation.tsx
│  │  │  │  │  ├─ FollowButton.tsx
│  │  │  │  │  ├─ FollowersComponent.tsx
│  │  │  │  │  ├─ FollowingComponent.tsx
│  │  │  │  │  ├─ FriendButton.tsx
│  │  │  │  │  ├─ FriendRequestBadge.tsx
│  │  │  │  │  ├─ FriendRequestItem.tsx
│  │  │  │  │  ├─ FriendRequestsScreen.tsx
│  │  │  │  │  ├─ FriendsList.tsx
│  │  │  │  │  ├─ InterestsList.tsx
│  │  │  │  │  ├─ ProfileFooter.tsx
│  │  │  │  │  ├─ ProfileHeader.tsx
│  │  │  │  │  ├─ RequestsScreen.tsx
│  │  │  │  │  ├─ ResizableSection.tsx
│  │  │  │  │  ├─ SavedScreen.tsx
│  │  │  │  │  ├─ Subscriptions.tsx
│  │  │  │  │  ├─ UserEventList.tsx
│  │  │  │  │  ├─ UserProfileScreen.tsx
│  │  │  │  │  ├─ UserServiceList.tsx
│  │  │  │  │  └─ WheelNavigation.tsx
│  │  │  │  ├─ Request.tsx
│  │  │  │  ├─ SaveButton.tsx
│  │  │  │  ├─ styles
│  │  │  │  │  └─ eventDetailsStyles.ts
│  │  │  │  ├─ UserAvatar.tsx
│  │  │  │  ├─ UserProfile.tsx
│  │  │  │  └─ YourEventCard.tsx
│  │  │  ├─ EventDetailScreen.tsx
│  │  │  ├─ LocalService
│  │  │  │  ├─ LocalServiceCard.tsx
│  │  │  │  ├─ LocalServiceDetailScreen.tsx
│  │  │  │  └─ LocalServiceScreen.tsx
│  │  │  ├─ LocalServiceCreation
│  │  │  │  ├─ CreateLocalServiceStack.tsx
│  │  │  │  ├─ CreateLocalServiceStep1.tsx
│  │  │  │  ├─ CreateLocalServiceStep2.tsx
│  │  │  │  ├─ CreateLocalServiceStep3.tsx
│  │  │  │  ├─ CreateLocalServiceStep4.tsx
│  │  │  │  └─ CreateLocalServiceStep5.tsx
│  │  │  ├─ map
│  │  │  │  └─ EventMap.tsx
│  │  │  ├─ NavBar.tsx
│  │  │  ├─ PersonalServiceComponents
│  │  │  │  ├─ AvailabilityList.tsx
│  │  │  │  ├─ BookButton.tsx
│  │  │  │  ├─ BookingForm.tsx
│  │  │  │  ├─ BookingStatus.tsx
│  │  │  │  ├─ cards.tsx
│  │  │  │  ├─ CategoryList.tsx
│  │  │  │  ├─ CommentSection.tsx
│  │  │  │  ├─ customButton.tsx
│  │  │  │  ├─ DetailsList.tsx
│  │  │  │  ├─ Header.tsx
│  │  │  │  ├─ ImageCarousel.tsx
│  │  │  │  ├─ PersonalInfo.tsx
│  │  │  │  ├─ personalServiceCalandar.tsx
│  │  │  │  ├─ ReviewForm.tsx
│  │  │  │  ├─ sections.tsx
│  │  │  │  ├─ ServiceFilters.tsx
│  │  │  │  ├─ ServiceGrid.tsx
│  │  │  │  ├─ ServiceItem.tsx
│  │  │  │  ├─ ServiceList.tsx
│  │  │  │  └─ StaffServiceCard.tsx
│  │  │  ├─ PersonalServiceCreation
│  │  │  │  ├─ createPersonalServiceStack.tsx
│  │  │  │  ├─ CreatePersonalServiceStep1.tsx
│  │  │  │  ├─ CreatePersonalServiceStep2.tsx
│  │  │  │  ├─ CreatePersonalServiceStep3.tsx
│  │  │  │  ├─ CreatePersonalServiceStep4.tsx
│  │  │  │  └─ CreatePersonalServiceStep5.tsx
│  │  │  ├─ SectionComponent.tsx
│  │  │  ├─ ServiceIcons.tsx
│  │  │  ├─ standardComponents
│  │  │  │  ├─ cards.tsx
│  │  │  │  ├─ customButton.tsx
│  │  │  │  └─ sections.tsx
│  │  │  └─ VIPServicesContainer.tsx
│  │  ├─ fake_data
│  │  │  ├─ addAvailabilty.tsx
│  │  │  ├─ createEvents.tsx
│  │  │  ├─ createEvetCategories.tsx
│  │  │  ├─ createImages.tsx
│  │  │  ├─ createLocation.tsx
│  │  │  ├─ createServiceCategory.tsx
│  │  │  ├─ createServices.tsx
│  │  │  ├─ fetchImages.tsx
│  │  │  ├─ helpers
│  │  │  │  ├─ geAllUsers.tsx
│  │  │  │  ├─ getAllEvents.tsx
│  │  │  │  ├─ getAllLocals.tsx
│  │  │  │  ├─ getAllMaterials.tsx
│  │  │  │  ├─ getAllPersonal.tsx
│  │  │  │  └─ getAllSubCategories.tsx
│  │  │  ├─ index.tsx
│  │  │  ├─ indexEvent.tsx
│  │  │  └─ indexService.tsx
│  │  ├─ index.css
│  │  ├─ navigation
│  │  │  ├─ AppNavigation.tsx
│  │  │  └─ types.ts
│  │  ├─ redux
│  │  │  ├─ slices
│  │  │  │  ├─ eventSlice.ts
│  │  │  │  └─ userSlice.ts
│  │  │  └─ store
│  │  │     └─ store.ts
│  │  ├─ saveed
│  │  │  └─ saveMapView.tsx
│  │  ├─ screens
│  │  │  ├─ AccountScreen.tsx
│  │  │  ├─ CalendarScreen.tsx
│  │  │  ├─ CategorySelectionScreen.tsx
│  │  │  ├─ clean.tsx
│  │  │  ├─ CreateServiceScreen.tsx
│  │  │  ├─ EditProfileScreen.tsx
│  │  │  ├─ EventChat.tsx
│  │  │  ├─ EventCreationScreen.tsx
│  │  │  ├─ EventDetailsScreen.tsx
│  │  │  ├─ EventMarquee.tsx
│  │  │  ├─ EventsScreen.tsx
│  │  │  ├─ EventTimelineScreen.tsx
│  │  │  ├─ EvnetStupOptionScreen.tsx
│  │  │  ├─ GuestManagementScreen.tsx
│  │  │  ├─ Home.tsx
│  │  │  ├─ HomeScreen.tsx
│  │  │  ├─ Interests.tsx
│  │  │  ├─ LandingPage.tsx
│  │  │  ├─ MainTabNavigator.tsx
│  │  │  ├─ MapScreen.tsx
│  │  │  ├─ MusicAndEntertainmentScreen.tsx
│  │  │  ├─ NotificationsScreen.tsx
│  │  │  ├─ OnBoarding.tsx
│  │  │  ├─ OnBoardingFlow.tsx
│  │  │  ├─ PersonalServiceScreen
│  │  │  │  ├─ PersonalDetail.tsx
│  │  │  │  ├─ PersonalsScreen.tsx
│  │  │  │  ├─ ServiceItem.tsx
│  │  │  │  └─ styles.ts
│  │  │  ├─ screen.tsx
│  │  │  ├─ ServiceSelection.tsx
│  │  │  ├─ ServicesScreen.tsx
│  │  │  ├─ subcategorySelectionScreen.tsx
│  │  │  ├─ TeamCollaborationScreen.tsx
│  │  │  ├─ TicketingScreen.tsx
│  │  │  └─ VenueSelectionScreen.tsx
│  │  ├─ services
│  │  │  ├─ interactionService.ts
│  │  │  ├─ personalQueries.ts
│  │  │  ├─ personalService.ts
│  │  │  ├─ requestService.ts
│  │  │  ├─ serviceTypes.ts
│  │  │  └─ supabaseClient.tsx
│  │  ├─ store
│  │  │  └─ store.tsx
│  │  ├─ styles
│  │  │  └─ style.tsx
│  │  ├─ types
│  │  │  ├─ react-native-snap-carousel.d.ts
│  │  │  └─ types.ts
│  │  ├─ UserContext.tsx
│  │  └─ utils
│  │     └─ util.tsx
│  ├─ app.config.ts
│  ├─ App.tsx
│  ├─ babel.config.js
│  ├─ CommonStyles
│  │  └─ CommonStyles.ts
│  ├─ env.d.ts
│  ├─ lib
│  │  └─ supabase.ts
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ sqlFolder
│  │  ├─ allowuser.sql
│  │  ├─ dropPolicies.sql
│  │  ├─ droptables.sql
│  │  ├─ policiesAndTriggers.sql
│  │  └─ schema.sql
│  ├─ tailwind.config.js
│  └─ tsconfig.json
└─ README.md

```
```
eventHub
├─ et --hard 3f42ac7dfab660ffd48645ae3f14328c17baa50e
├─ et --hard 780c68359a11b4ea3be660f7e0f532f01368141e
├─ et --hard commit-hash
├─ my-app
│  ├─ %ProgramData%
│  │  └─ Microsoft
│  │     └─ Windows
│  │        └─ UUS
│  │           └─ State
│  │              └─ _active.uusver
│  ├─ .env
│  ├─ .expo
│  │  ├─ devices.json
│  │  └─ README.md
│  ├─ app
│  │  ├─ api
│  │  │  └─ event
│  │  │     └─ eventApi.ts
│  │  ├─ assets
│  │  │  ├─ adaptive-icon.png
│  │  │  ├─ background.png
│  │  │  ├─ favicon.png
│  │  │  ├─ icon.png
│  │  │  ├─ slide1.jpg
│  │  │  ├─ slide2.jpg
│  │  │  ├─ slide3.jpg
│  │  │  ├─ slide4.jpg
│  │  │  ├─ splash.png
│  │  │  ├─ splash1.png
│  │  │  └─ svgs
│  │  │     └─ OnBoardingSvg.tsx
│  │  ├─ components
│  │  │  ├─ Auth
│  │  │  │  ├─ SignIn.tsx
│  │  │  │  └─ SignUp.tsx
│  │  │  ├─ Background.tsx
│  │  │  ├─ Calendar.tsx
│  │  │  ├─ component.tsx
│  │  │  ├─ event
│  │  │  │  ├─ AttendeesSection.tsx
│  │  │  │  ├─ BeautifulSectionHeader.tsx
│  │  │  │  ├─ ChatListScreen.tsx
│  │  │  │  ├─ ChatRoomScreen.tsx
│  │  │  │  ├─ CommentsSection.tsx
│  │  │  │  ├─ CustomButton.tsx
│  │  │  │  ├─ EventCard.tsx
│  │  │  │  ├─ EventDetails.tsx
│  │  │  │  ├─ EventSection.tsx
│  │  │  │  ├─ EventSectionContainer.tsx
│  │  │  │  ├─ JoinEventButton.tsx
│  │  │  │  ├─ OrganizerProfileScreen.tsx
│  │  │  │  ├─ PhotosSection.tsx
│  │  │  │  ├─ profile
│  │  │  │  │  ├─ AlbumList.tsx
│  │  │  │  │  ├─ AttendedEventList.tsx
│  │  │  │  │  ├─ CircularNavigation.tsx
│  │  │  │  │  ├─ FollowButton.tsx
│  │  │  │  │  ├─ FollowersComponent.tsx
│  │  │  │  │  ├─ FollowingComponent.tsx
│  │  │  │  │  ├─ FriendButton.tsx
│  │  │  │  │  ├─ FriendRequestBadge.tsx
│  │  │  │  │  ├─ FriendRequestItem.tsx
│  │  │  │  │  ├─ FriendRequestsScreen.tsx
│  │  │  │  │  ├─ FriendsList.tsx
│  │  │  │  │  ├─ InterestsList.tsx
│  │  │  │  │  ├─ ProfileFooter.tsx
│  │  │  │  │  ├─ ProfileHeader.tsx
│  │  │  │  │  ├─ RequestsScreen.tsx
│  │  │  │  │  ├─ ResizableSection.tsx
│  │  │  │  │  ├─ SavedScreen.tsx
│  │  │  │  │  ├─ Subscriptions.tsx
│  │  │  │  │  ├─ UserEventList.tsx
│  │  │  │  │  ├─ UserProfileScreen.tsx
│  │  │  │  │  ├─ UserServiceList.tsx
│  │  │  │  │  └─ WheelNavigation.tsx
│  │  │  │  ├─ Request.tsx
│  │  │  │  ├─ SaveButton.tsx
│  │  │  │  ├─ styles
│  │  │  │  │  └─ eventDetailsStyles.ts
│  │  │  │  ├─ UserAvatar.tsx
│  │  │  │  ├─ UserProfile.tsx
│  │  │  │  └─ YourEventCard.tsx
│  │  │  ├─ EventDetailScreen.tsx
│  │  │  ├─ LocalService
│  │  │  │  ├─ LocalServiceCard.tsx
│  │  │  │  ├─ LocalServiceDetailScreen.tsx
│  │  │  │  └─ LocalServiceScreen.tsx
│  │  │  ├─ LocalServiceCreation
│  │  │  │  ├─ CreateLocalServiceStack.tsx
│  │  │  │  ├─ CreateLocalServiceStep1.tsx
│  │  │  │  ├─ CreateLocalServiceStep2.tsx
│  │  │  │  ├─ CreateLocalServiceStep3.tsx
│  │  │  │  ├─ CreateLocalServiceStep4.tsx
│  │  │  │  └─ CreateLocalServiceStep5.tsx
│  │  │  ├─ map
│  │  │  │  └─ EventMap.tsx
│  │  │  ├─ NavBar.tsx
│  │  │  ├─ PersonalServiceComponents
│  │  │  │  ├─ AvailabilityList.tsx
│  │  │  │  ├─ BookButton.tsx
│  │  │  │  ├─ BookingForm.tsx
│  │  │  │  ├─ BookingStatus.tsx
│  │  │  │  ├─ cards.tsx
│  │  │  │  ├─ CategoryList.tsx
│  │  │  │  ├─ CommentSection.tsx
│  │  │  │  ├─ customButton.tsx
│  │  │  │  ├─ DetailsList.tsx
│  │  │  │  ├─ Header.tsx
│  │  │  │  ├─ ImageCarousel.tsx
│  │  │  │  ├─ PersonalInfo.tsx
│  │  │  │  ├─ personalServiceCalandar.tsx
│  │  │  │  ├─ ReviewForm.tsx
│  │  │  │  ├─ sections.tsx
│  │  │  │  ├─ ServiceFilters.tsx
│  │  │  │  ├─ ServiceGrid.tsx
│  │  │  │  ├─ ServiceItem.tsx
│  │  │  │  ├─ ServiceList.tsx
│  │  │  │  └─ StaffServiceCard.tsx
│  │  │  ├─ PersonalServiceCreation
│  │  │  │  ├─ createPersonalServiceStack.tsx
│  │  │  │  ├─ CreatePersonalServiceStep1.tsx
│  │  │  │  ├─ CreatePersonalServiceStep2.tsx
│  │  │  │  ├─ CreatePersonalServiceStep3.tsx
│  │  │  │  ├─ CreatePersonalServiceStep4.tsx
│  │  │  │  └─ CreatePersonalServiceStep5.tsx
│  │  │  ├─ SectionComponent.tsx
│  │  │  ├─ ServiceIcons.tsx
│  │  │  ├─ standardComponents
│  │  │  │  ├─ cards.tsx
│  │  │  │  ├─ customButton.tsx
│  │  │  │  └─ sections.tsx
│  │  │  └─ VIPServicesContainer.tsx
│  │  ├─ fake_data
│  │  │  ├─ addAvailabilty.tsx
│  │  │  ├─ createEvents.tsx
│  │  │  ├─ createEvetCategories.tsx
│  │  │  ├─ createImages.tsx
│  │  │  ├─ createLocation.tsx
│  │  │  ├─ createServiceCategory.tsx
│  │  │  ├─ createServices.tsx
│  │  │  ├─ fetchImages.tsx
│  │  │  ├─ helpers
│  │  │  │  ├─ geAllUsers.tsx
│  │  │  │  ├─ getAllEvents.tsx
│  │  │  │  ├─ getAllLocals.tsx
│  │  │  │  ├─ getAllMaterials.tsx
│  │  │  │  ├─ getAllPersonal.tsx
│  │  │  │  └─ getAllSubCategories.tsx
│  │  │  ├─ index.tsx
│  │  │  ├─ indexEvent.tsx
│  │  │  └─ indexService.tsx
│  │  ├─ index.css
│  │  ├─ navigation
│  │  │  ├─ AppNavigation.tsx
│  │  │  └─ types.ts
│  │  ├─ redux
│  │  │  ├─ slices
│  │  │  │  ├─ eventSlice.ts
│  │  │  │  └─ userSlice.ts
│  │  │  └─ store
│  │  │     └─ store.ts
│  │  ├─ saveed
│  │  │  └─ saveMapView.tsx
│  │  ├─ screens
│  │  │  ├─ AccountScreen.tsx
│  │  │  ├─ CalendarScreen.tsx
│  │  │  ├─ CategorySelectionScreen.tsx
│  │  │  ├─ clean.tsx
│  │  │  ├─ CreateServiceScreen.tsx
│  │  │  ├─ EditProfileScreen.tsx
│  │  │  ├─ EventChat.tsx
│  │  │  ├─ EventCreationScreen.tsx
│  │  │  ├─ EventDetailsScreen.tsx
│  │  │  ├─ EventMarquee.tsx
│  │  │  ├─ EventsScreen.tsx
│  │  │  ├─ EventTimelineScreen.tsx
│  │  │  ├─ EvnetStupOptionScreen.tsx
│  │  │  ├─ GuestManagementScreen.tsx
│  │  │  ├─ Home.tsx
│  │  │  ├─ HomeScreen.tsx
│  │  │  ├─ Interests.tsx
│  │  │  ├─ LandingPage.tsx
│  │  │  ├─ MainTabNavigator.tsx
│  │  │  ├─ MapScreen.tsx
│  │  │  ├─ MusicAndEntertainmentScreen.tsx
│  │  │  ├─ NotificationsScreen.tsx
│  │  │  ├─ OnBoarding.tsx
│  │  │  ├─ OnBoardingFlow.tsx
│  │  │  ├─ PersonalServiceScreen
│  │  │  │  ├─ PersonalDetail.tsx
│  │  │  │  ├─ PersonalsScreen.tsx
│  │  │  │  ├─ ServiceItem.tsx
│  │  │  │  └─ styles.ts
│  │  │  ├─ screen.tsx
│  │  │  ├─ ServiceSelection.tsx
│  │  │  ├─ ServicesScreen.tsx
│  │  │  ├─ subcategorySelectionScreen.tsx
│  │  │  ├─ TeamCollaborationScreen.tsx
│  │  │  ├─ TicketingScreen.tsx
│  │  │  └─ VenueSelectionScreen.tsx
│  │  ├─ services
│  │  │  ├─ interactionService.ts
│  │  │  ├─ personalQueries.ts
│  │  │  ├─ personalService.ts
│  │  │  ├─ requestService.ts
│  │  │  ├─ serviceTypes.ts
│  │  │  └─ supabaseClient.tsx
│  │  ├─ store
│  │  │  └─ store.tsx
│  │  ├─ styles
│  │  │  └─ style.tsx
│  │  ├─ types
│  │  │  ├─ react-native-snap-carousel.d.ts
│  │  │  └─ types.ts
│  │  ├─ UserContext.tsx
│  │  └─ utils
│  │     └─ util.tsx
│  ├─ app.config.ts
│  ├─ App.tsx
│  ├─ babel.config.js
│  ├─ CommonStyles
│  │  └─ CommonStyles.ts
│  ├─ env.d.ts
│  ├─ lib
│  │  └─ supabase.ts
│  ├─ metro.config.js
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ sqlFolder
│  │  ├─ allowuser.sql
│  │  ├─ dropPolicies.sql
│  │  ├─ droptables.sql
│  │  ├─ policiesAndTriggers.sql
│  │  └─ schema.sql
│  ├─ tailwind.config.js
│  └─ tsconfig.json
└─ README.md

```