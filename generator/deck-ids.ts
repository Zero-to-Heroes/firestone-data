import { AllCardsService } from '@firestone-hs/reference-data';
import cardsJson from './cards.json';
import source from './source.json';

const buildCardsService = () => {
	const service = new AllCardsService();
	service['allCards'] = [...(cardsJson as any[])];
	return service;
};

const getCardFromName = (allCards: AllCardsService, cardName: string): string => {
	let matches = allCards
		.getCards()
		.filter((card) => card.collectible)
		.filter((card) => card.name === cardName);
	if (matches.length !== 1) {
		matches = matches.filter((card) => card.type !== 'Hero');
		if (matches.length !== 1) {
			console.error('invalid matches', cardName, matches);
		}
	}
	return matches[0].id;
};

const generateAchievements = async () => {
	const allCards = buildCardsService();
	const result = source.map((item) => {
		return {
			class: item.class.toLowerCase(),
			archetype: item.archetype.replace(/\s/g, '_').toLowerCase(),
			cardId: getCardFromName(allCards, item.cardName),
			points: item.points,
			gameFormat: item.gameFormat.toLowerCase(),
		};
	});
	console.log(JSON.stringify(result));
};
generateAchievements();
