<?php
	header("Content-Type: application/json");
	echo $_GET["callback"]."({'animalType':'mammal'})";