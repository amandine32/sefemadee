import { useState } from 'react';
import { Post, DangerReport, Conversation, SafeMate } from '@/types/database';

export function useMockData() {
  const [posts, setPosts] = useState<Post[]>([
    {
      id: '1',
      author: 'Amina',
      authorAvatar: 'https://images.pexels.com/photos/1181424/pexels-photo-1181424.jpeg', // Femme voilée
      content: "Je viens de passer par le quartier Saint-Michel, il y a beaucoup de monde et l'ambiance est sécurisante !",
      imageUrl: 'https://images.pexels.com/photos/1850619/pexels-photo-1850619.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      timestamp: Date.now() - 3600000,
      likes: ['2', '3'],
      comments: [
        { id: '1', author: 'Marie', content: "Merci pour l'info !", timestamp: Date.now() - 3000000 }
      ]
    },
    {
      id: '2',
      author: 'Keiko',
      authorAvatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg', // Femme asiatique
      content: "J'ai trouvé un super groupe de running féminin qui se retrouve tous les mardis soirs. On se sent vraiment en sécurité ensemble !",
      imageUrl: null,
      timestamp: Date.now() - 86400000,
      likes: ['1'],
      comments: []
    },
    {
      id: '3',
      author: 'Fatou',
      authorAvatar: 'https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg', // Femme noire
      content: 'Nouveau café ouvert rue des Martyrs, très accueillant et le personnel est attentif. Ils proposent même de vous raccompagner à votre voiture le soir.',
      imageUrl: 'https://images.pexels.com/photos/1855214/pexels-photo-1855214.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      timestamp: Date.now() - 172800000,
      likes: ['1', '2', '4'],
      comments: [
        { id: '2', author: 'Claire', content: "C'est vrai que c'est super !", timestamp: Date.now() - 86400000 }
      ]
    },
    {
      id: '4',
      author: 'Marie',
      authorAvatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg',
      content: "Sortie nocturne réussie grâce à SafeMate ! J'ai pu rentrer en toute sécurité avec le suivi GPS. Merci les filles pour vos messages 💕",
      imageUrl: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      timestamp: Date.now() - 259200000,
      likes: ['2', '3', '5'],
      comments: [
        { id: '3', author: 'Amina', content: "De rien ! On est là pour ça 😊", timestamp: Date.now() - 200000000 }
      ]
    },
    {
      id: '5',
      author: 'Marie',
      authorAvatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg',
      content: "Première fois que j'utilise le trajet partagé et c'était parfait ! J'ai rencontré Keiko et on a fait le chemin ensemble. Se sentir en sécurité, ça n'a pas de prix.",
      imageUrl: null,
      timestamp: Date.now() - 432000000,
      likes: ['2', '3', '4', '6'],
      comments: []
    }
  ]);

  const [stories] = useState([
    {
      id: '1',
      user: {
        id: '1',
        name: 'Amina',
        avatar: 'https://images.pexels.com/photos/1181424/pexels-photo-1181424.jpeg', // Femme voilée
      },
      hasUnseenStory: true,
      timestamp: Date.now() - 1800000, // 30 minutes ago
      media: [
        {
          type: 'image',
          url: 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', // Mosquée/lieu de prière
          duration: 5000,
        },
        {
          type: 'image',
          url: 'https://images.pexels.com/photos/1181424/pexels-photo-1181424.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', // Portrait d'Amina
          duration: 5000,
        }
      ]
    },
    {
      id: '2',
      user: {
        id: '2',
        name: 'Keiko',
        avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg', // Femme asiatique
      },
      hasUnseenStory: true,
      timestamp: Date.now() - 7200000, // 2 hours ago
      media: [
        {
          type: 'image',
          url: 'https://images.pexels.com/photos/1566837/pexels-photo-1566837.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', // Jardin japonais/zen
          duration: 5000,
        },
        {
          type: 'image',
          url: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', // Portrait de Keiko
          duration: 5000,
        }
      ]
    },
    {
      id: '3',
      user: {
        id: '3',
        name: 'Fatou',
        avatar: 'https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg', // Femme noire
      },
      hasUnseenStory: false,
      timestamp: Date.now() - 43200000, // 12 hours ago
      media: [
        {
          type: 'image',
          url: 'https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', // Portrait de Fatou
          duration: 5000,
        },
        {
          type: 'image',
          url: 'https://images.pexels.com/photos/1855214/pexels-photo-1855214.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', // Café chaleureux
          duration: 5000,
        }
      ]
    },
    {
      id: '4',
      user: {
        id: '4',
        name: 'Elena',
        avatar: 'https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg', // Femme blanche plus âgée
      },
      hasUnseenStory: true,
      timestamp: Date.now() - 3600000, // 1 hour ago
      media: [
        {
          type: 'image',
          url: 'https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', // Portrait d'Elena
          duration: 5000,
        },
        {
          type: 'image',
          url: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', // Activité communautaire/bénévolat
          duration: 5000,
        }
      ]
    }
  ]);

  const [dangerReports] = useState<DangerReport[]>([
    {
      id: '1',
      position: { latitude: 48.8566, longitude: 2.3522 },
      description: "Groupe d'hommes insistants près de la sortie du métro",
      riskLevel: 'medium',
      timestamp: Date.now() - 1800000
    },
    {
      id: '2',
      position: { latitude: 48.8606, longitude: 2.3376 },
      description: "Ruelle mal éclairée, préférez l'avenue principale",
      riskLevel: 'low',
      timestamp: Date.now() - 3600000,
      imageUrl: 'https://images.pexels.com/photos/315191/pexels-photo-315191.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' // Ruelle sombre
    },
    {
      id: '3',
      position: { latitude: 48.8496, longitude: 2.3578 },
      description: 'Agression signalée ce soir, évitez le secteur',
      riskLevel: 'high',
      timestamp: Date.now() - 7200000
    },
    {
      id: '4',
      position: { latitude: 48.8556, longitude: 2.3522 },
      description: 'Éclairage public défaillant dans cette zone',
      riskLevel: 'medium',
      timestamp: Date.now() - 10800000,
      imageUrl: 'https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' // Éclairage défaillant
    },
    {
      id: '5',
      position: { latitude: 48.8738, longitude: 2.2950 },
      description: 'Harcèlement de rue signalé plusieurs fois',
      riskLevel: 'high',
      timestamp: Date.now() - 14400000,
      imageUrl: 'https://images.pexels.com/photos/1181424/pexels-photo-1181424.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' // Femme inquiète
    },
    {
      id: '6',
      position: { latitude: 48.8584, longitude: 2.2945 },
      description: 'Zone peu fréquentée le soir, restez vigilantes',
      riskLevel: 'low',
      timestamp: Date.now() - 18000000,
      imageUrl: 'https://images.pexels.com/photos/2166711/pexels-photo-2166711.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' // Rue déserte
    }
  ]);

  const [conversations] = useState<Conversation[]>([
    {
      id: '1',
      name: 'Amina',
      avatar: 'https://images.pexels.com/photos/1181424/pexels-photo-1181424.jpeg', // Femme voilée
      participants: ['1', '2'],
      lastMessage: {
        id: '101',
        senderId: '2',
        content: 'Tu es bien arrivée ?',
        type: 'text',
        timestamp: Date.now() - 900000
      },
      unreadCount: 2
    },
    {
      id: '2',
      name: 'Keiko',
      avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg', // Femme asiatique
      participants: ['1', '3'],
      lastMessage: {
        id: '201',
        senderId: '1',
        content: 'Message vocal',
        type: 'voice',
        timestamp: Date.now() - 43200000
      },
      unreadCount: 0
    }
  ]);

  const [safeMates] = useState<SafeMate[]>([
    {
      id: '2',
      name: 'Amina Benali',
      avatar: 'https://images.pexels.com/photos/1181424/pexels-photo-1181424.jpeg',
      city: 'Paris 11ème',
      age: 26,
      mutualFriends: 3,
      compatibility: 92,
      status: 'accepted',
      connectedSince: Date.now() - 2592000000, // 30 jours
      lastSeen: Date.now() - 3600000, // 1 heure
      bio: "Passionnée de voyages et de photographie. J'aime découvrir de nouveaux endroits en sécurité !",
      interests: ['Voyages', 'Photographie', 'Cuisine', 'Lecture'],
      safetyScore: 95
    },
    {
      id: '3',
      name: 'Keiko Tanaka',
      avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg',
      city: 'Paris 3ème',
      age: 24,
      mutualFriends: 2,
      compatibility: 88,
      status: 'accepted',
      connectedSince: Date.now() - 1296000000, // 15 jours
      lastSeen: Date.now() - 1800000, // 30 minutes
      bio: "Étudiante en design, j'adore l'art et les balades urbaines. Toujours partante pour explorer la ville !",
      interests: ['Design', 'Art', 'Running', 'Café'],
      safetyScore: 90
    },
    {
      id: '4',
      name: 'Fatou Diallo',
      avatar: 'https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg',
      city: 'Paris 18ème',
      age: 29,
      mutualFriends: 5,
      compatibility: 85,
      status: 'accepted',
      connectedSince: Date.now() - 5184000000, // 60 jours
      lastSeen: Date.now() - 7200000, // 2 heures
      bio: "Professeure et militante. Je crois en la force de la solidarité féminine pour créer des espaces sûrs.",
      interests: ['Éducation', 'Militantisme', 'Danse', 'Cinéma'],
      safetyScore: 98
    },
    {
      id: '5',
      name: 'Elena Rodriguez',
      avatar: 'https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg',
      city: 'Paris 14ème',
      age: 31,
      mutualFriends: 1,
      compatibility: 78,
      status: 'pending',
      bio: "Maman de deux enfants, je cherche des personnes de confiance pour les sorties en famille ou entre amies.",
      interests: ['Famille', 'Yoga', 'Jardinage', 'Cuisine'],
      safetyScore: 87
    },
    {
      id: '6',
      name: 'Sofia Chen',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg',
      city: 'Paris 5ème',
      age: 27,
      mutualFriends: 4,
      compatibility: 94,
      status: 'pending',
      bio: "Développeuse passionnée de tech et de sécurité numérique. J'aime partager mes connaissances !",
      interests: ['Technologie', 'Sécurité', 'Gaming', 'Musique'],
      safetyScore: 93
    }
  ]);

  return {
    posts,
    stories,
    dangerReports,
    conversations,
    safeMates
  };
}