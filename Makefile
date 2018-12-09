SHELL := /bin/bash
export PATH := ./node_modules/.bin:$(PATH)
NODECG_PATH := ./node_modules/nodecg

postinstall:
	cd $(NODECG_PATH) && bower install --production
	ln -sf ../../../rtainjapan-layouts $(NODECG_PATH)/bundles
	ln -sf ../../cfg $(NODECG_PATH)
