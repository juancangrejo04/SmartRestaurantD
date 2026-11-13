import fs from 'fs';

const branches = JSON.parse(fs.readFileSync('scripts/branches.json', 'utf8'));

// 30 Multilingual Reviews (6 reviews per country across 5 languages)
const REVIEWS = [];
const reviewerNames = [
  { name: 'Carolina Ramírez', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80', country: 'CO' },
  { name: 'Gabriel Barbosa', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80', country: 'BR' },
  { name: 'Emily Clark', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80', country: 'US' },
  { name: 'Pierre Laurent', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80', country: 'FR' },
  { name: 'Kenji Tanaka', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80', country: 'JP' },
  { name: 'Mariana Duarte', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80', country: 'BR' },
];

const sampleComments = [
  {
    comment: {
      es: 'Una experiencia gastronómica inolvidable. El servicio por QR fue inmediato y los platos llegaron en su punto perfecto.',
      en: 'An unforgettable culinary experience. The table QR order was swift and dishes arrived at absolute perfection.',
      pt: 'Uma experiência gastronômica inesquecível. O pedido pelo QR foi rápido e os pratos chegaram perfeitos.',
      fr: 'Une expérience gastronomique inoubliable. La commande par QR fut instantanée et les assiettes parfaites.',
      ja: '忘れられない美食体験でした。テーブルQRでの注文はとてもスムーズで、料理も最高の焼き加減でした。'
    },
    reply: {
      text: {
        es: '¡Muchas gracias por su visita! Nos alegra saber que disfrutó de nuestra propuesta culinaria.',
        en: 'Thank you very much for your visit! We are thrilled you enjoyed our culinary craft.',
        pt: 'Muito obrigado pela visita! Ficamos felizes que tenha apreciado nossa gastronomia.',
        fr: 'Merci infiniment pour votre visite! Nous sommes ravis que notre cuisine vous ait comblé.',
        ja: 'ご来店誠にありがとうございました！おもてなしとお料理をお楽しみいただけて光栄です。'
      },
      repliedAt: '2026-11-10T14:30:00Z',
      repliedBy: 'Equipo de Sala'
    }
  },
  {
    comment: {
      es: 'El almuerzo del día superó todas mis expectativas: ingredientes fresquísimos y una cocción a las brasas impecable.',
      en: 'The daily lunch special exceeded all expectations: remarkably fresh produce and flawless charcoal grilling.',
      pt: 'O almoço do dia superou as expectativas: ingredientes fresquíssimos e ponto da brasa impecável.',
      fr: 'Le plat du jour a dépassé toutes mes attentes: produits d’une fraîcheur remarquable et cuisson au feu de bois impeccable.',
      ja: '本日のおすすめランチは期待以上でした。食材の鮮度が際立ち、炭火の香ばしさが格別でした。'
    },
    reply: {
      text: {
        es: 'Es un placer atenderle. Cada mañana preparamos el almuerzo del día con productos locales de proximidad.',
        en: 'A pleasure serving you. We craft our daily lunch every morning using fresh regional harvest.',
        pt: 'Foi um prazer atendê-lo. Preparamos o almoço do dia diariamente com ingredientes locais selecionados.',
        fr: 'Tout le plaisir est pour nous. Nous élaborons le menu du jour chaque matin avec les arrivages frais.',
        ja: '温かいお言葉をいただき感謝申し上げます。毎朝仕入れる旬の素材で心を込めてお作りしております。'
      },
      repliedAt: '2026-11-09T18:00:00Z',
      repliedBy: 'Chef Ejecutivo'
    }
  },
  {
    comment: {
      es: 'Ambiente sofisticado y cálido. La reserva en línea funcionó sin demoras ni filas.',
      en: 'Sophisticated yet warm ambiance. The online table reservation worked seamlessly with zero wait time.',
      pt: 'Ambiente sofisticado e acolhedor. A reserva online funcionou sem filas nem atrasos.',
      fr: 'Ambiance feutrée et chaleureuse. La réservation en ligne a fonctionné sans la moindre attente.',
      ja: '洗練されつつも温かみのある空間。事前のオンライン予約で待ち時間なく案内されました。'
    }
  }
];

let revId = 1;
for (const b of branches) {
  if (revId > 30) break;
  const reviewer = reviewerNames[(revId - 1) % reviewerNames.length];
  const template = sampleComments[(revId - 1) % sampleComments.length];

  REVIEWS.push({
    id: `rev-${revId}`,
    restaurantId: b.restaurantId,
    branchId: b.id,
    userName: reviewer.name,
    userAvatar: reviewer.avatar,
    rating: revId % 5 === 0 ? 4 : 5,
    comment: template.comment,
    reply: template.reply,
    status: 'approved',
    createdAt: new Date(Date.now() - (revId * 86400000)).toISOString(),
  });
  revId++;
}

console.log('Total sample reviews generated across 5 languages:', REVIEWS.length);
fs.writeFileSync('scripts/seed_reviews.json', JSON.stringify(REVIEWS, null, 2));
