html:
	jekyll build --watch

serve:
	jekyll serve --watch

install:
	echo 'Installing dependencies'
	npm install

install_jekyll:
	sudo gem install jekyll jekyll-paginate pygments.rb --verbose
