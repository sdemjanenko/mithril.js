//qunit doesn't support Function.prototype.bind...
if (!Function.prototype.bind) {
	Function.prototype.bind = function (oThis) {
		if (typeof this !== "function") {
			// closest thing possible to the ECMAScript 5
			// internal IsCallable function
			throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
		}

		var aArgs = Array.prototype.slice.call(arguments, 1), 
				fToBind = this, 
				fNOP = function () {},
				fBound = function () {
					return fToBind.apply(this instanceof fNOP && oThis
						? this
						: oThis,
						aArgs.concat(Array.prototype.slice.call(arguments)));
				};

		fNOP.prototype = this.prototype;
		fBound.prototype = new fNOP();

		return fBound;
	};
}



//tests
var dummyEl = document.getElementById('dummy')

test('Mithril accessible as window.m', function() {
	expect(1);
	ok(window.m);
});


test('array item removal', function() {
	expect(2);
	var view1 = m('div', {}, [
		m('div', {}, '0'),
		m('div', {}, '1'),
		m('div', {}, '2')
	]);

	var view2= m('div', {}, [
		m('div', {}, '0'),
	]);

	m.render(dummyEl, view1);
	equal(dummyEl.innerHTML, '<div><div>0</div><div>1</div><div>2</div></div>', 'view1 rendered correctly');

	m.render(dummyEl, view2);
	equal(dummyEl.innerHTML, '<div><div>0</div></div>', 'view2 should be rendered correctly');

});

test('issue99 regression', function() {
	// see https://github.com/lhorie/mithril.js/issues/99
	expect(2);
	var view1 = m('div', {}, [
		m('div', {}, '0'),
		m('div', {}, '1'),
		m('div', {}, '2')
	]);

	var view2= m('div', {}, [
		m('span', {}, '0'),
	]);

	m.render(dummyEl, view1);
	equal(dummyEl.innerHTML, '<div><div>0</div><div>1</div><div>2</div></div>', 'view1 rendered correctly');

	m.render(dummyEl, view2);
	equal(dummyEl.innerHTML, '<div><span>0</span></div>', 'view2 should be rendered correctly');
});

test('config handler context', function() {
	expect(3);
	var view = m('div', {config: function(evt, isInitialized, context){
		equal(context instanceof Object, true);
		context.data = 1;
	}})
	m.render(dummyEl, view);

	var view = m('div', {config: function(evt, isInitialized, context){
		equal(context instanceof Object, true);
		equal(context.data, 1);
	}})
	m.render(dummyEl, view);
})
