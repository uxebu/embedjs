function normalize_path(){
	# Remove all /./ sequences.
	local   path=${1//\/.\//\/}

	# Remove dir/.. sequences.
	while [[ $path =~ ([^/][^/]*/\.\./) ]]
	do
		path=${path/${BASH_REMATCH[0]}/}
	done
	echo $path
}