aws s3 cp file/secrets_config.json s3://static.zerotoheroes.com/hearthstone/data/ --acl public-read
aws s3 cp file/patches.json s3://static.zerotoheroes.com/hearthstone/data/ --acl public-read
aws s3 cp file/ai_decks s3://static.zerotoheroes.com/hearthstone/data/ai_decks --recursive --acl public-read
aws s3 cp file/achievements s3://static.zerotoheroes.com/hearthstone/data/achievements --recursive --acl public-read

# Decks

It looks like that the game uses the HERO_DECK_ID to notify what deck is being used. If this is consistently used
throughout the game, we could probably just rely on this ID to fetch the correct deck, instead of using scenarioID + opponent card

# Generator

You will need `ts-node` installed globally to run the generators
