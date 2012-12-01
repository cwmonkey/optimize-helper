<!doctype html>
<head>
	<title>My Smilies - Your smilies</title>
	<link rel="stylesheet" type="text/css" href="/optimize-helper.css?<?=filemtime('optimize-helper.css')?>">
	<script>window.calling_ref = '<?=urldecode($_GET['ref'])?>';</script>
	<script src="/json2.js"></script>
	<script src="//ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js"></script>
	<script src="/jquery.ba-postmessage.min.js"></script>
	<script src="/optimize-helper_script.js?<?=filemtime('optimize-helper_script.js')?>"></script>
</head>

<body>
	<div id="page">
		<h1>Optimize it, sucka</h1>
		<div id="experiments">
		</div>
		<p id="add_experiment">
			<input type="submit" value="Add Experiment" />
		</p>
	</div>

	<script id="experimenttpl" type="x-javascript-template">
		<div id="experiment_{experiment}" class="experiment"  data-experiment="{experiment}">
			<h2>
				<label for="experiment_name_{experiment}">Experiment:</label>
				<input type="text" name="experiment_name" id="experiment_name_{experiment}" value="{experiment_name}" />
			</h2>
			<div id="experiment_variations_{experiment}" class="experiment_variations">
			</div>
			<p id="add_variation_{experiment}" class="add_variation">
				<input type="submit" value="Add Variation" />
			</p>
		</div>
	</script>

	<script id="variationtpl" type="x-javascript-template">
		<div id="variation{variation}_container" class="variation_container" data-variation="{variation}">
			<p class="radio">
				<input type="radio" name="experiment{experiment}variation" value="{variation}" id="experiment{experiment}variation{variation}" />
				<label for="variation{variation}">Variation {variation}</label>
			</p>
			<p class="text">
				<label for="name{variation}" class="label_name">Name</label>
				<input type="text" name="experiment{experiment}variation_name" id="experiment{experiment}variation{variation}" value="{variation_name}" />
			</p>
		</div>
	</script>
</body>