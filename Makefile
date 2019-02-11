serve:
	jekyll serve --watch --unpublished --port 5000

html:
	jekyll build --watch --unpublished

install:
	echo 'Installing dependencies'
	npm install

install_jekyll:
	sudo gem install jekyll jekyll-paginate jekyll-sitemap --verbose
