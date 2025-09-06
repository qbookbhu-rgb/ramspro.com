import type { SVGProps } from 'react';
import { Stethoscope, HeartPulse, Brain, Bone, Baby, Eye, Search, Calendar, MessageSquare, HeartHandshake, Dumbbell, Smile, Grape, Siren, Video, Phone, Hospital, User, Pill, FlaskConical, Ambulance, Sparkles, Briefcase, Building } from 'lucide-react';

export const doctors = [
  {
    id: '1',
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
    id: '2',
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
    id: '3',
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
    id: '4',
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
    id: '5',
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
    id: '6',
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
        icon: HeartHandshake,
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

export const registrationRoles = [
    { name: 'Patient', href: '/register/patient', icon: User, description: 'Book appointments and manage your health.' },
    { name: 'Doctor / Practitioner', href: '/register/doctor', icon: Stethoscope, description: 'Provide consultations as an individual practitioner.' },
    { name: 'Clinic / Hospital', href: '/register/doctor', icon: Building, description: 'Register your entire clinic or hospital.' },
    { name: 'Pharmacy', href: '#', icon: Pill, description: 'Manage orders and sell medicines.' },
    { name: 'Lab / Diagnostics', href: '#', icon: FlaskConical, description: 'Manage test bookings and reports.' },
    { name: 'Ambulance', href: '#', icon: Ambulance, description: 'Provide emergency transport services.' },
];
