import type { SVGProps } from 'react';
import { Stethoscope, HeartPulse, Brain, Bone, Baby, Eye, Search, Calendar, MessageSquare, Yoga, Dumbbell, Smile, Grape, Siren, Video, Phone, Hospital } from 'lucide-react';

export const doctors = [
  {
    name: 'Dr. Ananya Sharma',
    specialty: 'Cardiologist',
    location: 'Mumbai, India',
    availability: 'online',
    image: 'https://picsum.photos/200/200?random=1',
    rating: 4.8,
    reviews: 132,
    dataAiHint: 'doctor portrait',
  },
  {
    name: 'Dr. Vikram Singh',
    specialty: 'Neurologist',
    location: 'Delhi, India',
    availability: 'in-clinic',
    image: 'https://picsum.photos/200/200?random=2',
    rating: 4.9,
    reviews: 98,
    dataAiHint: 'doctor smiling',
  },
  {
    name: 'Dr. Priya Patel',
    specialty: 'Orthopedic Surgeon',
    location: 'Bangalore, India',
    availability: 'online',
    image: 'https://picsum.photos/200/200?random=3',
    rating: 4.7,
    reviews: 210,
    dataAiHint: 'female doctor',
  },
  {
    name: 'Dr. Rohan Joshi',
    specialty: 'Pediatrician',
    location: 'Pune, India',
    availability: 'in-clinic',
    image: 'https://picsum.photos/200/200?random=4',
    rating: 4.9,
    reviews: 156,
    dataAiHint: 'male doctor',
  },
  {
    name: 'Dr. Sameera Khan',
    specialty: 'General Physician',
    location: 'Chennai, India',
    availability: 'online',
    image: 'https://picsum.photos/200/200?random=5',
    rating: 4.8,
    reviews: 340,
    dataAiHint: 'physician portrait',
  },
  {
    name: 'Dr. Arjun Reddy',
    specialty: 'Ophthalmologist',
    location: 'Hyderabad, India',
    availability: 'in-clinic',
    image: 'https://picsum.photos/200/200?random=6',
    rating: 4.6,
    reviews: 88,
    dataAiHint: 'doctor glasses',
  },
];

export const specialties = [
    { name: 'Cardiology', icon: HeartPulse },
    { name: 'Neurology', icon: Brain },
    { name: 'Orthopedics', icon: Bone },
    { name: 'Pediatrics', icon: Baby },
    { name: 'Ophthalmology', icon: Eye },
    { name: 'General Medicine', icon: Stethoscope },
];

export const howItWorksSteps = [
    {
      icon: Search,
      title: 'Find Your Doctor',
      description: 'Search by specialty or symptoms to find the right doctor for you.',
    },
    {
      icon: Calendar,
      title: 'Book an Appointment',
      description: 'Choose a convenient time and book a video, audio, or in-clinic visit.',
    },
    {
      icon: MessageSquare,
      title: 'Consult Online',
      description: 'Connect with your doctor from the comfort of your home.',
    },
];

export const wellnessItems = [
    {
        icon: Yoga,
        title: 'Yoga & Mindfulness',
        description: 'Find your inner peace with guided yoga and meditation sessions.',
        image: 'https://picsum.photos/600/400?random=11',
        dataAiHint: 'yoga outdoors',
    },
    {
        icon: Dumbbell,
        title: 'Fitness & Workouts',
        description: 'Stay active with personalized fitness plans and workout videos.',
        image: 'https://picsum.photos/600/400?random=12',
        dataAiHint: 'fitness workout',
    },
    {
        icon: Smile,
        title: 'Mental Wellness',
        description: 'Access resources and support for a healthier mind.',
        image: 'https://picsum.photos/600/400?random=13',
        dataAiHint: 'mental health',
    },
    {
        icon: Grape,
        title: 'Diet & Nutrition',
        description: 'Get expert advice and diet plans for a balanced lifestyle.',
        image: 'https://picsum.photos/600/400?random=14',
        dataAiHint: 'healthy food',
    },
];

export const consultationTypes = [
    { name: 'Video', icon: Video },
    { name: 'Audio', icon: Phone },
    { name: 'Chat', icon: MessageSquare },
    { name: 'In-Clinic', icon: Hospital },
]

export const languages = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'हिन्दी' },
    { code: 'bn', name: 'বাংলা' },
    { code: 'te', name: 'తెలుగు' },
];
