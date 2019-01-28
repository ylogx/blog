serve:
	jekyll serve --watch --port 5000

html:
	jekyll build --watch

install:
	echo 'Installing dependencies'
	npm install

install_jekyll:
	sudo gem install jekyll jekyll-paginate jekyll-sitemap --verbose
