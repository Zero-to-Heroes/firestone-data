aws s3 cp file/secrets_config.json s3://static.zerotoheroes.com/hearthstone/data/ --acl public-read
aws s3 cp file/patches.json s3://static.zerotoheroes.com/hearthstone/data/ --acl public-read
aws s3 cp file/ai_decks s3://static.zerotoheroes.com/hearthstone/data/ai_decks --recursive --acl public-read
aws s3 cp file/achievements s3://static.zerotoheroes.com/hearthstone/data/achievements --recursive --acl public-read

aws s3 cp file/battlegrounds-strategies.json s3://static.zerotoheroes.com/hearthstone/data/battlegrounds-strategies/battlegrounds-strategies.json --acl public-read
aws s3 cp file/lottery-config.json s3://static.zerotoheroes.com/hearthstone/data/lottery-config.json --acl public-read
