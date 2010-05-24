require.modify("dojo/html", "dojo/html/query-simple", ["dojo"], function(){
(function(d){
	d._query = function(query, parentNode){
		// summary: Works with ".className", "#id", and ".className .className"
		// Actually we would need querySelectorAll() :-).
		// But we don't have it, so we just kinda fake it.
		var parts = query.split(" ");
		if (parts.length > 1){
			return this.query(parts.slice(1).join(" "), this.query(parts[0]));
		}
		if (query.charAt(0)=="."){
			return document.getElementsByClassName(query.substr(1));
		}
		if (query.charAt(0)=="#"){
			return [document.getElementById(query.substr(1))];
		}
		return [];
	}
})(dojo);

dojo.query = dojo._query;
});