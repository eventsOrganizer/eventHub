declare module 'react-native-snap-carousel' {
    import { Component } from 'react';
    import { StyleProp, ViewStyle } from 'react-native';
    export interface CarouselProps<T> {
      data: T[];
      renderItem: (item: { item: T; index: number }) => React.ReactNode;
      sliderWidth: number;
      itemWidth: number;
      inactiveSlideScale?: number;
      inactiveSlideOpacity?: number;
      activeSlideAlignment?: 'center' | 'end' | 'start';
      autoplay?: boolean;
      autoplayDelay?: number;
      autoplayInterval?: number;
      loop?: boolean;
      enableSnap?: boolean;
      containerCustomStyle?: StyleProp<ViewStyle>;
      contentContainerCustomStyle?: StyleProp<ViewStyle>;
      useScrollView?: boolean;
    }
  
    export default class Carousel<T> extends Component<CarouselProps<T>> {}
  }

  declare module 'react-native-vector-icons/FontAwesome';