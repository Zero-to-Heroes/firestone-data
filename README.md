aws s3 cp bgs_heroes_info.json s3://static.zerotoheroes.com/hearthstone/data/ --acl public-read
aws s3 cp ai_decks s3://static.zerotoheroes.com/hearthstone/data/ai_decks --recursive --acl public-read
aws s3 cp achievements s3://static.zerotoheroes.com/hearthstone/data/achievements --recursive --acl public-read

# Decks

It looks like that the game uses the HERO_DECK_ID to notify what deck is being used. If this is consistently used
throughout the game, we could probably just rely on this ID to fetch the correct deck, instead of using scenarioID + opponent card
