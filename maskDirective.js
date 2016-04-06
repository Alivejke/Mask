app.directive('mask',['maskService', function(maskService) {
	var setOptionValue = function (options, field, value) {
			if(angular.isDefined(value)) {
				options[field] = value;
			};
			return options;							
		},
		getNextCursorPosition = function(mask, maskValue, cursorPosition, direction) {
			cursorPosition = cursorPosition || 0;
			direction = direction || 1;
			for(var i = cursorPosition; direction > 0 ? i < mask.length : i >= 0; i += direction) {
				if(mask[i] === maskValue) {
					break;								
				}
			}
			if(cursorPosition - i > 1 && direction < 0) {
				i ++;
			}
			return i;
		},
		getEndTextPosition = function(maskedValue, maskValue) {
			for(var i = 0; i < maskedValue.length; i ++) {
				if(maskedValue[i] === maskValue) {
					break;
				}
			}
			return i;						
		},
		isValid = function(value, mask, inputValueMask) {
			return value.length == maskService.getAllowedValueLength(mask, inputValueMask)
		};
		
	
	return {
			restrict : 'A',
			require: '^ngModel',
			scope: {},
			link : function (scope, iElement, iAttr, mCtrl) {
				var options = {
					inputValueType : 'number',
					inputValueMask : '_',
					inputMask : ''
				};
				
				var currentCaretPosition, cursorDirection;
				
				options = setOptionValue(options, 'inputValueType', iAttr['inputValueType']);
				options = setOptionValue(options, 'inputValueMask', iAttr['inputValueMask']);
				options = setOptionValue(options, 'inputMask', iAttr['inputMask']);

				
				// converts the model value into the view value
				mCtrl.$formatters.push(function(value) {
					if(!angular.isDefined(value)) {
						mCtrl.$setValidity('maskValid',false);
						return options.inputMask;
					} else {
						return maskService.applyMask(value, options.inputMask, options.inputValueMask, options.inputValueType);;
					}; 
				});
				// converts the view value into the model value
				mCtrl.$parsers.push(function(value){
					// check if all chars are satisfy the type requrenments
					if(options.inputValueType == 'number') {
						value = value.split('').filter(function(ch){
							return isFinite(ch);
						}).join('');
					};
					// save the current cursor position
					currentCaretPosition = iElement[0].selectionStart;
					// remove the mask from the value
					value = maskService.getOriginalValue(value, options.inputMask);
					// check if the value satisfyes requred length
					value = value
						.split('')
						.slice(0, maskService.getAllowedValueLength(options.inputMask, options.inputValueMask))
						.join('');
					//check validation
					mCtrl.$setValidity('maskValid', isValid(value, options.inputMask, options.inputValueMask));
					//apply the mask to the value
					var maskedValue = maskService.applyMask(value, options.inputMask, options.inputValueMask, options.inputValueType);
					// render the value of component
					if(mCtrl.$viewValue != maskedValue) {
						// define in which side the cursor has to be moved
						if(mCtrl.$modelValue) {
							cursorDirection = mCtrl.$modelValue.length < value.length ? 1 : -1;
						} else {
							cursorDirection = 1;
						}
						// render the view value
						mCtrl.$setViewValue(maskedValue);
						mCtrl.$render();
						// move the cursor
						iElement[0].selectionStart 	= getNextCursorPosition(options.inputMask, options.inputValueMask, currentCaretPosition, cursorDirection);
						iElement[0].selectionEnd 	= getNextCursorPosition(options.inputMask, options.inputValueMask, currentCaretPosition, cursorDirection);
						var endOfText = getEndTextPosition(maskedValue, options.inputValueMask);
						if(iElement[0].selectionStart > endOfText) {
							iElement[0].selectionStart = endOfText;
							iElement[0].selectionEnd = endOfText;
						}		
					}
					// give model the true value without the mask					 
					return value;
				});
				
				iElement.on('focus mouseup', function(){
					var cursorStartingPosition = getNextCursorPosition(options.inputMask, options.inputValueMask);
					if(iElement[0].selectionStart < cursorStartingPosition) {
						iElement[0].selectionStart 	= cursorStartingPosition;
						iElement[0].selectionEnd 	= cursorStartingPosition;
					}
				});
			}	
		}	
}]);