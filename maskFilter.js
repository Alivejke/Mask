app.filter('maskFilter',['maskService', function(maskService){
	return  function (value, pattern, comparator) {
		if(value)
			return maskService.applyMask(value, pattern, comparator, 'string');
		else
			return value;
	}
}])