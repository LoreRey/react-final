import gameAttributes from "../game-attributes.js";

export default function() {
	this.vars.ws.onmessage = incoming_message => {
		let player;
		const message = JSON.parse(incoming_message.data);
		switch (message.subject) {
			case "push":
				player = this.entities.players.individuals[message.player_id];
				let x_velocity = message.velocity.x;
				let y_velocity = message.velocity.y;

				if (y_velocity > 0) {
					player.rotation = Math.atan(x_velocity / y_velocity);
				} else if (y_velocity === 0.0) {
					if (x_velocity < 0) {
						player.rotation = 0.5 * Math.PI;
					} else {
						player.rotation = 1.5 * Math.PI;
					}
				} else {
					player.rotation = Math.atan(x_velocity / y_velocity) + Math.PI;
				}
				player.setVelocityX(8000.0 * x_velocity);
				player.setVelocityY(-8000.0 * y_velocity);

				break;
			case "shoot":
				player = this.entities.players.individuals[message.player_id];
				player.shooting = message.shooting;
				console.log(player);
				break;
		}
	};

	const background = this.add.image(
		gameAttributes.gameWidth / 2,
		gameAttributes.gameHeight / 2,
		"background"
	);

	background.setScale(window.devicePixelRatio * 2);

	this.entities.players = {
		individuals: {},
		group: this.physics.add.group({
			key: "pigeon",
			setXY: {
				x: -50,
				y: -50
				// stepX: 60
			}
		})
	};

	this.entities.healthTexts = {};

	const addPlayer = (player_id, playerNumber) => {
		let player = this.entities.players.group.create(
			gameAttributes.gameWidth / 2,
			gameAttributes.gameHeight / 2,
			"pigeon"
		);
		player.id = player_id;
		player.name = 'Player' + (playerNumber + 1).toString();
		player.alive = true;
		player.killcount = 0;
		player.health = 3;
		player.shooting = false;
		player.disabled = false;
		player.setCollideWorldBounds(true);
		player.setVelocityX(0);
		player.setVelocityY(0);
		player.x = Math.random() * gameAttributes.gameWidth;
		player.y = Math.random() * gameAttributes.gameHeight;

		return player;
	};

	for (let i = 0; i < this.vars.player_ids.length; i++) {
		let player_id = this.vars.player_ids[i];
		let newPlayer = addPlayer(player_id, i);
		this.entities.players.individuals[player_id] = newPlayer;

		let newHealthText = this.add.text(100, 100 + i * 50, newPlayer.name + ' Health:' + newPlayer.health, { font: "32px Arial", fill: generateHexColor() });
		newHealthText.id = player_id;
		this.entities.healthTexts[player_id] = newHealthText;
	}

	function generateHexColor() {
    return '#' + ((0.5 + 0.5 * Math.random()) * 0xFFFFFF << 0).toString(16);
	}

			// textGroup.add(game.make.text(100, 64 + i * 32, 'here is a colored line of text',  { font: "32px Arial", fill: generateHexColor() }));

	// this.vars.player_ids.forEach(function(player_id) {
	// 	addPlayer(player_id);
	// });

	this.entities.enemies = this.physics.add.group({
		key: "falcon",
		setXY: {
			x: -50,
			y: -50
		}
	});

	this.time.addEvent({
		delay: 5000,
		callback: this.enemySpawn,
		callbackScope: this,
		loop: true
	});

	this.add.text(100, 200, `Code: ${gameAttributes.code}`);
	this.vars.gameScoreText = this.add.text(100, 100, `${this.vars.score}`);

	// this.vars.healthText = this.add.text(100, 120, "Health: " + this.vars.health);

	//////////////////////////////////

	this.entities.bullets = this.physics.add.group({
		defaultKey: "laser",
		repeat: 5,
		setCollideWorldBounds: true,
		setXY: { x: -50, y: -50 }
	});

	// bullets.createMultiple(40, 'laser')

	this.physics.add.collider(
		this.entities.enemies,
		this.entities.bullets,
		this.bulletEnemyCollision,
		null,
		this
	);
	this.physics.add.collider(
		this.entities.enemies,
		this.entities.players.group,
		this.playerEnemyCollision,
		null,
		this
	);
}
