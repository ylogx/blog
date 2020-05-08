serve:
	jekyll serve --watch --unpublished --port 5000

dserve:
	docker run --rm -it -v $${PWD}:/srv/jekyll -p 5000:5000 jekyll/jekyll make serve

html:
	jekyll build --watch --unpublished

install:
	echo 'Installing dependencies'
	npm install

install_jekyll:
	sudo gem install jekyll jekyll-paginate jekyll-sitemap --verbose
