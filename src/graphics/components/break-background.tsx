import React from 'react';
import dot1 from '../images/break/dot1.png';
import dot2 from '../images/break/dot2.png';
import dot3 from '../images/break/dot3.png';
import dot4 from '../images/break/dot4.png';
import rtachan from '../images/break/rtachan.png';
import * as classNames from './break-background.css';

export const BreakBackground = () => (
	<div className='bg'>
		<img src={dot1} className={classNames.deep1} />
		<img src={dot2} className={classNames.deep2} />
		<img src={dot3} className={classNames.deep3} />
		<img src={dot4} className={classNames.deep4} />
		<img src={dot4} className={classNames.deep5} />
		<img src={dot3} className={classNames.deep6} />
		<img src={dot2} className={classNames.deep7} />
		<img src={dot1} className={classNames.deep8} />
		<img src={dot1} className={classNames.pale1} />
		<img src={dot2} className={classNames.pale2} />
		<img src={dot3} className={classNames.pale3} />
		<img src={dot4} className={classNames.pale4} />
		<img src={dot4} className={classNames.pale5} />
		<img src={dot3} className={classNames.pale6} />
		<img src={dot2} className={classNames.pale7} />
		<img src={dot1} className={classNames.pale8} />
		<img src={rtachan} className={classNames.rtachan} />
	</div>
);
