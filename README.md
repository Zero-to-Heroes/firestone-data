aws s3 cp file/secrets_config.json s3://static.zerotoheroes.com/hearthstone/data/ --acl public-read
aws s3 cp file/patches.json s3://static.zerotoheroes.com/hearthstone/data/ --acl public-read
aws s3 cp file/ai_decks s3://static.zerotoheroes.com/hearthstone/data/ai_decks --recursive --acl public-read
aws s3 cp file/ai_decks s3://static.zerotoheroes.com/hearthstone/data/ai_decks --recursive --acl public-read
aws s3 cp file/tavern-brawl-open-lists s3://static.zerotoheroes.com/hearthstone/data/brawl_lists --recursive --acl public-read

aws s3 cp file/expert-contributors.json s3://static.zerotoheroes.com/hearthstone/data/expert-contributors.json --acl public-read
aws s3 cp file/lottery-config.json s3://static.zerotoheroes.com/api/lottery/lottery-config.json --acl public-read
aws s3 cp file/lottery-seasons.json s3://static.zerotoheroes.com/api/lottery/lottery-seasons.json --acl public-read
