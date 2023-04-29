import {useEffect} from "react";

type ResizeObserverCallback = (entry: ResizeObserverEntry) => void;

const elementCallbacks = new Map<Element, Set<ResizeObserverCallback>>();

const observer = new ResizeObserver((entries) => {
	for (const entry of entries) {
		const callbacks = elementCallbacks.get(entry.target);
		if (callbacks) {
			for (const callback of callbacks) {
				callback(entry);
			}
		}
	}
});

const addCallback = (element: Element, callback: ResizeObserverCallback) => {
	const callbacks = elementCallbacks.get(element);
	if (callbacks) {
		callbacks.add(callback);
	} else {
		observer.observe(element);
		elementCallbacks.set(element, new Set([callback]));
	}

	return () => {
		const callbacks = elementCallbacks.get(element);
		if (callbacks) {
			callbacks.delete(callback);
			if (callbacks.size === 0) {
				observer.unobserve(element);
				elementCallbacks.delete(element);
			}
		}
	};
};

export const useElementResize = <T extends HTMLElement>(
	ref: React.RefObject<T>,
	callback: (size: {width: number; height: number}) => void,
) => {
	useEffect(() => {
		if (!ref.current) {
			return;
		}
		const element = ref.current;
		const removeCallback = addCallback(element, (entry) => {
			const newWidth = entry.contentRect.width;
			const newHeight = entry.contentRect.height;
			callback({width: newWidth, height: newHeight});
		});
		return () => {
			removeCallback();
		};
	}, [ref, callback]);
};
