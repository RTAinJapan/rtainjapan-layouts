import React from 'react';
import ReactDom from 'react-dom';
import dot1 from '../images/break/dot1.png';
import dot2 from '../images/break/dot2.png';
import dot3 from '../images/break/dot3.png';
import dot4 from '../images/break/dot4.png';
import rtachan from '../images/break/rtachan.png';

const App = () => (
	<div className="bg">
		<img src={dot1} className="deep1" />
		<img src={dot2} className="deep2" />
		<img src={dot3} className="deep3" />
		<img src={dot4} className="deep4" />
		<img src={dot4} className="deep5" />
		<img src={dot3} className="deep6" />
		<img src={dot2} className="deep7" />
		<img src={dot1} className="deep8" />
		<img src={dot1} className="pale1" />
		<img src={dot2} className="pale2" />
		<img src={dot3} className="pale3" />
		<img src={dot4} className="pale4" />
		<img src={dot4} className="pale5" />
		<img src={dot3} className="pale6" />
		<img src={dot2} className="pale7" />
		<img src={dot1} className="pale8" />
		<img src={rtachan} className="rtachan" />
	</div>
);

ReactDom.render(<App />, document.getElementById('break'), () => {
	setTimeout(() => {
		document.body.style.opacity = '1';
	}, 1000);
});
