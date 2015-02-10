describe('fuzzyjs', function() {
	describe('default search', function() {
		it('finds the right string and surrounds it with a span tag', function() {
			var arr = ['A sentence composed of multiple words', 'Set syntax Javscript'];
			expect(fuzzy(arr, 'scmw')).toEqual(['A <span>s</span>enten<span>c</span>e co<span>m</span>posed of multiple <span>w</span>ords']);

		});
	});

	describe('custom surrounding tag', function() {
		it('finds the right string and surrounds it with a span tag', function() {
			var arr = ['A sentence composed of multiple words', 'Set syntax Javscript'];
			expect(fuzzy(arr, 'scmw', false, '<strong>', '</strong>')).toEqual(['A <strong>s</strong>enten<strong>c</strong>e co<strong>m</strong>posed of multiple <strong>w</strong>ords']);

		});
	});

	describe('case sensitive search', function() {
		it('finds only the lower case letter', function() {
			var arr = ['A sentence composed of multiple words', 'A sentence composed of multiple Words'];
			expect(fuzzy(arr, 'w', true, '', '')).toEqual(['A sentence composed of multiple words']);
		});

		it('finds only the upper case letter', function() {
			var arr = ['A sentence composed of multiple words', 'A sentence composed of multiple Words'];
			expect(fuzzy(arr, 'W', true, '', '')).toEqual(['A sentence composed of multiple Words']);
		});

	});

	describe('case insensitive search', function() {
		var arr = ['A sentence composed of multiple words', 'A sentence composed of multiple Words'];
		
		it('finds both case matches for lowercase search', function() {
			expect(fuzzy(arr, 'w', false, '', '')).toEqual(arr);
		});

		it('finds both case matches for uppercase search', function() {
			expect(fuzzy(arr, 'W', false, '', '')).toEqual(arr);
		});
	});
});