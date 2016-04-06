app.factory('maskService', [function(){
	return {
		/**
		 * Applyes chosen mask to the requered value
		 * @param {string} value 				- the mask will be applied to this value
		 * @param {string} mask 				- requred mask string
		 * @param {string} symbolEdentifier 	- symbol which defines where the original symbols
		 * 										can be placed within the mask
		 * 
		 * @returns {string} - masked value
		 */
		applyMask : function (value, mask, symbolEdentifier, valueType) {
			var valueIndex = 0;
			return mask.split('').map(function(maskChar){
				var ch = value[valueIndex]; 
				if(maskChar === symbolEdentifier && ch) {
					valueIndex ++;
					switch (valueType) {
						case 'number':
							if(isFinite(ch)) {
								return ch;
							} else {
								return maskChar;
							}
						case 'string':
							return ch;
					}
				} else {
					return maskChar;
				}
			}).join('');
		},
		/**
		 * Returns original value based on masked value and mask
		 * @params {string} maskedValue - value with applied mask
		 * @params {string} mask		- requed mask
		 * @return {string} - original value without the mask
		 */
		getOriginalValue : function (maskedValue, mask) {
			return maskedValue.split('').filter(function(vCh) {
				return mask.indexOf(vCh) == -1
			}).join('');
		},
		/**
		 * Returns the maximum length of the value which can be placed into mask
		 * @param {string} mask 				- the requred mask
		 * @param {string} symbolEdentifier 	- symbol which defines where the original symbols
		 * 										can be placed within the mask
		 * 
		 * @returs {number} - max value length
		 */
		getAllowedValueLength : function(mask, symbolEdentifier) {
			return mask.split('').filter(function(ch){
				return ch === symbolEdentifier;
			}).length;
		}
	}
}])