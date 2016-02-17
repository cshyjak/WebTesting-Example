describe('sample test suite', function() {
    it('basic title check', function() {
        return browser
            .url('http://google.ca')
            .getTitle().should.eventually.be.equal('Google');
    });
});