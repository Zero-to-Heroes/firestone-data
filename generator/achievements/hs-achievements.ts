import fetch from 'node-fetch';
import slugify from 'slugify';

const generateAchievements = async () => {
	const response = await fetch('https://static.zerotoheroes.com/hearthstone/jsoncards/hs-achievements.json?v=8');
	const config: HsAchievementsConfig = await response.json();

	const firestoneAchievements = buildFirestoneAchievements(config.achievements.filter((ach) => ach.name));

	const firestoneCategories: readonly AchievementCategoryConfiguration[] = config.categories.map((cat) =>
		buildCategory(cat, config),
	);
	const hearthstoneCategory: AchievementCategoryConfiguration = {
		id: 'hearthstone_game',
		icon: 'hearthstone_game',
		name: 'Hearthstone',
		categories: firestoneCategories,
	};

	// console.log(JSON.stringify(firestoneAchievements));
	console.log(JSON.stringify(hearthstoneCategory));
};

const buildCategory = (cat: Category, config: HsAchievementsConfig): AchievementCategoryConfiguration => {
	const subCategoryConfs = config.subCategories.filter((sub) => sub.categoryId === cat.id);
	const subCategories = subCategoryConfs.map((sub) => buildSubCategory(sub, config));

	return {
		id: `hearthstone_game_${cat.id}`,
		name: cat.name,
		icon: buildIcon(cat.name),
		categories: subCategories.length === 1 ? subCategories[0].categories : subCategories,
		// achievementTypes: subCategories.length === 1
	};
};

const buildSubCategory = (sub: SubCategory, config: HsAchievementsConfig): AchievementCategoryConfiguration => {
	const sectionItems = config.sectionItems
		.filter((item) => item.subCategoryId === sub.id)
		.sort((a, b) => a.sortOrder - b.sortOrder);
	const sections: AchievementCategoryConfiguration[] = sectionItems.map((item) => buildSection(item, config));
	return {
		id: `hearthstone_game_sub_${sub.id}`,
		name: sub.name,
		icon: buildIcon(sub.name),
		categories: sections.length === 1 ? undefined : sections,
		achievementTypes: sections.length === 1 ? sections[0].achievementTypes : undefined,
	};
};

const buildSection = (sectionItem: SectionItem, config: HsAchievementsConfig): AchievementCategoryConfiguration => {
	const section = config.sections.find((sec) => sec.id === sectionItem.sectionId);
	const hsAchievements = config.achievements
		.filter((ach) => ach.sectionId === sectionItem.sectionId)
		.sort((a, b) => a.sortOrder - b.sortOrder);
	const firestoneAchievements: readonly RawAchievement[] = buildFirestoneAchievements(hsAchievements);
	return {
		id: `hearthstone_game_section_${sectionItem.id}`,
		name: section.name,
		icon: buildIcon(section.name),
		achievementTypes: [...new Set(firestoneAchievements.map((ach) => ach.type))],
	};
};

const buildIcon = (name: string): string => {
	switch (name?.trim()?.toLowerCase()) {
		case 'darkmoon faire':
		case 'madness at the darkmoon faire':
			return 'darkmoon_faire';
		case 'ashes of outland':
			return 'ashes';
		case 'scholomance academy':
			return 'scholomance';
		case 'curse of naxxramas':
			return 'naxx';
		case 'goblins vs gnomes':
			return 'gvg';
		case 'blackrock mountain':
			return 'brm';
		case 'the grand tournament':
			return 'tgt';
		case 'whispers of the old gods':
			return 'og';
		case 'one night in karazhan':
			return 'kara';
		case 'mean streets of gadgetzan':
			return 'gadgetzan';
		case "journey to un'goro":
			return 'ungoro';
		case 'knights of the frozen throne':
			return 'icc';
		case 'kobolds and catacombs':
			return 'loot';
		case 'the witchwood':
			return 'wood';
		case 'the boomsday project':
			return 'boom';
		case "rastakhan's rumble":
			return 'troll';
		case 'rise of shadows':
			return 'shadows';
		case 'saviors of uldum':
			return 'saviors';
		case 'descent of dragons':
			return 'dragons';
		case "galakrond's awakening":
			return 'galakrond_set';
		case 'league of explorers':
			return 'loe';
		case 'classic':
			return name.trim().toLowerCase();

		case 'book of heroes':
			return 'book';

		case 'battlegrounds':
			return 'mode_battlegrounds';
		case 'duels':
			return 'mode_duels';
		// case 'arena':
		// 	return 'mode_arena';
		// case 'tavern brawl':
		// 	return 'mode_tavernbrawl';
		case 'ranked':
			return 'mode_ranked';

		case 'demon hunter':
			return 'demon_hunter';
		case 'druid':
		case 'hunter':
		case 'mage':
		case 'paladin':
		case 'priest':
		case 'rogue':
		case 'shaman':
		case 'warrior':
		case 'warlock':
			return name.trim().toLowerCase();
	}
	return 'general';
};

const buildFirestoneAchievements = (achievements: readonly Achievement[]): readonly RawAchievement[] => {
	const result: RawAchievement[] = [];
	for (const achievement of achievements) {
		const type = slugify(achievement.name, {
			replacement: '_',
			remove: /[\.!-,'\?]/g,
			lower: true,
			strict: true,
		});
		const text = achievement.description.replace('$q', '' + achievement.quota);
		const raw: RawAchievement = {
			hsAchievementId: achievement.id,
			id: `hearthstone_game_${achievement.id}`,
			type: `hearthstone_game_${type}`,
			name: achievement.name,
			displayName: achievement.name,
			icon: 'boss_victory',
			root: !achievements.some((ach) => ach.nextTierId === achievement.id),
			priority: computePriority(achievement, achievements),
			text: text,
			emptyText: text,
			completedText: text,
			quota: achievement.quota,
			displayCardId: 'ULDA_111', // Hearthstone
			displayCardType: 'spell',
			points: achievement.points,
		};
		result.push(raw);
	}
	return result;
};

const computePriority = (achievement: Achievement, allAchievements: readonly Achievement[]): number => {
	let priority = 0;
	let currentAchievement = achievement;
	let previousAchievement = allAchievements.find((ach) => ach.nextTierId === currentAchievement.id);
	while (previousAchievement) {
		priority++;
		currentAchievement = previousAchievement;
		previousAchievement = allAchievements.find((ach) => ach.nextTierId === currentAchievement.id);
	}
	return priority;
};

generateAchievements();

interface HsAchievementsConfig {
	readonly categories: readonly Category[];
	readonly subCategories: readonly SubCategory[];
	readonly sections: readonly Section[];
	readonly sectionItems: readonly SectionItem[];
	readonly achievements: readonly Achievement[];
}

interface Category {
	readonly id: number;
	readonly name: string;
}

interface SubCategory {
	readonly id: number;
	readonly name: string;
	readonly categoryId: number;
}

interface Section {
	readonly id: number;
	readonly name: string;
}

interface SectionItem {
	readonly id: number;
	readonly subCategoryId: number;
	readonly sectionId: number;
	readonly sortOrder: number;
}

interface Achievement {
	readonly id: number;
	readonly sectionId: number;
	readonly sortOrder: number;
	readonly enabled: number;
	readonly name: string;
	readonly description: string;
	readonly quota: number;
	readonly points: number;
	readonly rewardTrackXp: number;
	readonly rewardListId: number;
	readonly nextTierId: number;
}

interface AchievementCategoryConfiguration {
	readonly id: string;
	readonly name: string;
	readonly icon: string;
	readonly categories?: readonly AchievementCategoryConfiguration[];
	readonly achievementTypes?: readonly string[];
}
interface RawAchievement {
	readonly hsAchievementId: number;
	readonly id: string;
	readonly type: string;
	// The name of the achievement in the achievements view
	readonly name: string;
	// The icon to display in the completion steps
	readonly icon: string;
	readonly root?: boolean;
	readonly priority?: number;
	readonly displayName: string; // The header to display on the achievement notification
	readonly text?: string;
	readonly emptyText?: string;
	readonly completedText?: string;
	readonly displayCardId: string;
	readonly displayCardType: string;
	readonly quota: number;
	readonly points: number;
	readonly linkedAchievementIds?: readonly string[];
}
