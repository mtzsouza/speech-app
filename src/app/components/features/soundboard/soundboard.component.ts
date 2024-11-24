import { Component } from '@angular/core';
import { NavbarComponent } from '../../navbar/navbar.component';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-soundboard',
  standalone: true,
  imports: [NavbarComponent, RouterModule, CommonModule],
  templateUrl: './soundboard.component.html',
  styleUrl: './soundboard.component.sass'
})
export class SoundboardComponent {
  isPopupOpen: boolean = false;
  currentSound: string = '';
  showExamples: boolean = false;
  showPairs: boolean = false;

  // Example words for each sound
  examples: { [key: string]: string[] } = {
    '/eɪ/': ['Age', 'Cake', 'Display'],
    '/æ/': ['Act', 'After', 'Chance'],
    '/i/': ['East', 'Seem', 'Agree'],
    '/ɛ/': ['End', 'Enter', 'Friend'],
    '/aɪ/': ['Eye', 'Kind', 'Sky'],
    '/ɪ/': ['Into', 'Issue', 'Gift'],
    '/oʊ/': ['Old', 'Both', 'Snow'],
    '/ɑ/': ['Odd', 'Box', 'Not'],
    '/ju/': ['You', 'Cute', 'View'],
    '/ʌ/': ['Up', 'From', 'None'],
    '/ʊ/': ['Book', 'Push', 'Put'],
    'oo': ['Food', 'Move', 'Clue'],
    'aw': ['Off', 'Boss', 'Raw'],
    'ow': ['Our', 'Brown', 'Now'],
    'oi': ['Oil', 'Join', 'Toy'],
    'er': ['Earth', 'Burn', 'Stir'],
    'ar': ['Are', 'Charge', 'Far'],
    'or': ['Or', 'Force', 'Floor'],
    'air': ['Air', 'Berry', 'Scare'],
    'b': ['Back', 'Number', 'Job'],
    'ch': ['Charge', 'Kitchen', 'Inch'],
    'd': ['Dance', 'Middle', 'End'],
    'f': ['Face', 'Left', 'Half'],
    'g': ['Glad', 'Ago', 'Beg'],
    'h': ['Hand', 'How', 'Behind'],
    'j': ['Job', 'Agent', 'Strange'],
    'k': ['Cat', 'Act', 'Luck'],
    'l': ['Last', 'Glass', 'Feel'],
    'm': ['Month', 'Almost', 'Dream'],
    'n': ['Name', 'Once', 'Rain'],
    'ng': ['Hungry', 'Single', 'King'],
    'p': ['Page', 'Copy', 'Drop'],
    'r': ['Raise', 'Bring', 'Ear'],
    's': ['Small', 'Best', 'Nice'],
    'sh': ['Shape', 'Issue', 'Fish'],
    't': ['Take', 'Stop', 'Lost'],
    'th': ['Thank', 'Healthy', 'Bath'],
    'v': ['View', 'Even', 'Save'],
    'w': ['Won', 'Swim', 'Away'],
    'y': ['Year', 'Yet', 'Yellow'],
    'z': ['Zoo', 'Busy', 'His'],
    'zh': ['Measure', 'Vision', 'Massage'],
  };

  pairs: { [key: string]: string[] } = {
    '/eɪ/': ['Fail Feel', 'Grade Greed', 'Hate Heat'],
    '/æ/': ['Bad Bed', 'Bat Bet', 'Pack Peck'],
    '/i/': ['Cream Crime', 'Free Fry', 'Mean Mine'],
    '/ɛ/': ['Bed Bid', 'Bet Bit', 'Head Hid'],
    '/aɪ/': ['Bite Boat', 'Night Note', 'Drive Drove'],
    '/ɪ/': ['Chip Chop', 'Click Clock', 'Drip Drop'],
    '/oʊ/': ['Coat Cute', 'Foe Few', 'Foam Fume'],
    '/ɑ/': ['Doll Dull', 'Fond Fund', 'Hot Hut'],
    '/ju/': ['Cube Cab', 'Mule Mill', 'Cute Cut'],
    '/ʌ/': ['Buck Book', 'Bum Boom', 'Bug Bog'],
    '/ʊ/': ['Full Fool', 'Put Pout', 'Bull Ball'],
    'oo': ['Fool Fall', 'Bruise Browse', 'Sue Soy'],
    'aw': ['Ball Boil', 'Drawn Drown', 'Gone Gown'],
    'ow': ['Bow Boy', 'Owl Oil', 'Plow Ploy'],
    'oi': ['Boil Bail', 'Coin Keen', 'Moist Most'],
    'er': ['Earth Worth', 'Burn Born', 'Stir Store'],
    'ar': ['Hard Had', 'Park Pack', 'Harm Ham'],
    'or': ['Cord Card', 'Port Part', 'Short Shirt'],
    'air': ['Hair Here', 'Fair Far', 'Chair Char'],
    'b': ['Buy Pie', 'Bay Say', 'Best Vest'],
    'ch': ['Cheep Jeep', 'Chew Shoe', 'Chock Shock'],
    'd': ['Dam Jam', 'Day They', 'Town Down'],
    'f': ['Fan Van', 'Free Three', 'Fast Past'],
    'g': ['Game Came', 'Good Wood', 'Bag Back'],
    'h': ['Hate Ate', 'Hail Rail', 'Hall Fall'],
    'j': ['Jar Char', 'Jam Yam', 'Jog Dog'],
    'k': ['Kick Quick', 'Cold Gold', 'Brink Bring'],
    'l': ['Alive Arrive', 'Long Wrong', 'Feel Feed'],
    'm': ['Sum Son', 'Cam Can', 'Foam Phone'],
    'n': ['Pin Ping', 'Sin Sing', 'Win Wing'],
    'ng': ['Bang Bank', 'Ring Rink', 'Bling Blink'],
    'p': ['Tip Tiff', 'Whiff Whip', 'Pet Bet'],
    'r': ['Rock Lock', 'Rate Hate', 'Reel Wheel'],
    's': ['Sick Thick', 'Rice Rise', 'Bus Buzz'],
    'sh': ['Shave Save', 'Ship Chip', 'Dish Ditch'],
    't': ['Not Nod', 'Mount Mound', 'Tip Dip'],
    'th': ['There Dare', 'Thick Tick', 'Clothe Close'],
    'v': ['Vent Went', 'Vat Fat', 'Very Bury'],
    'w': ['Wake Ache', 'Which Rich', 'Wait Ate'],
    'y': ['Yes Guess', 'Year Hear', 'Yell Gel'],
    'z': ['Vies Vice', 'Laze Lathe', 'Rays Rage'],
    'zh': ['Usual Useful', 'Vision Mission'],
  };

  handleOutsideClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
  
    if (target.classList.contains('menu')) {
      this.closePopup();
    }
  }
  
  openPopup(sound: string): void {
    this.isPopupOpen = true;
    this.currentSound = sound;
    this.showExamples = false; // Reset to main menu
    this.showPairs = false;
  }

  closePopup(): void {
    this.isPopupOpen = false;
    this.currentSound = '';
  }

  currentAudio: HTMLAudioElement | null = null; // Shared audio object for both methods

  playSound(sound: string): void {
      if (this.currentAudio) {
        this.currentAudio.pause(); // Pause the currently playing audio
        this.currentAudio.currentTime = 0; // Reset to the beginning
      }
      sound = sound.replace(/\//g, ''); // Remove '/' characters
      this.currentAudio = new Audio(`/assets/sounds/engPronunciations/${sound}.mp3`);
      this.currentAudio.play();
  }
  
  playExample(sound: string): void {
      if (this.currentAudio) {
        this.currentAudio.pause(); // Pause the currently playing audio
        this.currentAudio.currentTime = 0; // Reset to the beginning
      }
      sound = sound.toLocaleLowerCase(); // Convert to lowercase
      this.currentAudio = new Audio(`/assets/sounds/engExamples/${sound}.mp3`);
      this.currentAudio.play();
  }

  playPair(sound: string): void {
    if (this.currentAudio) {
      this.currentAudio.pause(); // Pause the currently playing audio
      this.currentAudio.currentTime = 0; // Reset to the beginning
    }
    console.log(sound);
    this.currentAudio = new Audio(`/assets/sounds/engPairs/${sound}.mp3`);
    this.currentAudio.play();
  }

  toggleExamples(show: boolean): void {
    this.showExamples = show;
  }

  togglePairs(show: boolean): void {
    this.showPairs = show;
  }
}
