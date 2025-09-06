
import type { SVGProps } from 'react';
import { Stethoscope, HeartPulse, Brain, Bone, Baby, Eye, Search, Calendar, MessageSquare, HeartHandshake, Dumbbell, Smile, Grape, Siren, Video, Phone, Hospital, User, Pill, FlaskConical, Ambulance, Sparkles, Briefcase, Building, Ear, Shield, Leaf, Beaker } from 'lucide-react';

export const specialties = [
    { name: 'General Medicine', icon: Stethoscope },
    { name: 'Cardiology', icon: HeartPulse },
    { name: 'Neurology', icon: Brain },
    { name: 'Orthopedics', icon: Bone },
    { name: 'Pediatrics', icon: Baby },
    { name: 'Ophthalmology', icon: Eye },
    { name: 'Dermatology', icon: Shield },
    { name: 'ENT', icon: Ear },
    { name: 'Ayurveda', icon: Leaf },
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
    { name: 'In-Clinic', icon: Hospital },
]

export const languages = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'हिन्दी' },
    { code: 'bn', name: 'বাংলা' },
    { code: 'te', name: 'తెలుగు' },
];

export const registrationRoles = [
    { name: 'Patient', href: '/register/patient', icon: User, description: 'Book appointments and manage your health.', disabled: false },
    { name: 'Doctor / Clinic', href: '/register/doctor', icon: Stethoscope, description: 'Provide consultations or register your clinic.', disabled: false },
    { name: 'Ambulance', href: '/register/ambulance', icon: Ambulance, description: 'Provide emergency transport services.', disabled: false },
    { name: 'Pharmacy', href: '#', icon: Pill, description: 'Manage orders and sell medicines.', disabled: true },
    { name: 'Lab / Diagnostics', href: '/register/lab', icon: Beaker, description: 'Manage test bookings and reports.', disabled: false },
];
