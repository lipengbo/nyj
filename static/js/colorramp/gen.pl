#!/usr/bin/perl

=comment

This script generates a <color ramp filename>.color.txt file for each color ramp image in the ramps directory.
This file contains all the colors used in the ramp.

It also creates a rampindex.txt file containing the filenames of all color ramp images in the ramps directory.

=cut

use strict;
use FindBin qw($Bin);
use GD();
use JSON::XS();

sub rgb2hex {
  my (@rgb) = @_;
  my @hex = map { $_=sprintf("%x",$_); (length==1) ? "0$_" : $_ } @rgb;
  return join('', @hex);
}

my @files;

chdir "$Bin/jquery-colorramp/ramps" or die "couldn't chdir to ramps";

foreach my $fn (sort <*.png>) {
  push @files, $fn;
  my $im = GD::Image->newFromPng($fn) or die "Can't load PNG $fn: $!";
  my ($w,$h) = $im->getBounds;

  # trim height on image if necessary
  if ($h > 1) {
    my $new_h = 1;
    my $new_w = $w;
    my $small = GD::Image->new($new_w,$new_h);
    $small->copyResized($im, 0, 0, 0, 0, $new_w, $new_h, $w,$h);
    open my $fh, "> $fn" or die $!;
    print $fh $small->png;
    close $fh;
    $im = $small;
    $h = $new_h;
  }

  # find all colors used in ramp from left to right
  my @colors;
  for (my ($x,$l) = (0, $w - 1); $x < $l; ++$x) {
    my $px = $im->getPixel($x,0);
    my @rgb = $im->rgb($px);
    my $rgb = rgb2hex(@rgb);
    push @colors, $rgb unless $colors[$#colors] eq $rgb;
  }

  open my $fh, "> $fn.colors.txt" or die $!;
  print $fh join(' ', @colors);
  close $fh;
}

open my $fh, "> ../rampindex.txt" or die $!;
print $fh join("\n", @files);
close $fh;
